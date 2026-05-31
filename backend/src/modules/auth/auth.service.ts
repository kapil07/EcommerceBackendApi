import { IJwtPayload } from "../../types/index.js";
import { AppError } from "../../utils/AppError.js";
import {
  comparePassword,
  hashPassword,
  hashRefreshToken,
} from "../../utils/auth.helper.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { toJwtPayload, toUserResponse } from "./auth.mapper.js";
import {
  loginUserDTO,
  logoutUserDTO,
  refreshTokenDTO,
  registerUserDTO,
} from "./auth.schema.js";

export class AuthService {
  constructor(private repo: IAuthRepository) {}

  async registerUserService(data: registerUserDTO) {
    const { firstName, lastName, email, password, phoneNumber, role } = data;

    const existingUser = await this.repo.getUserByEmail(email);

    if (existingUser) {
      throw new AppError("User with this email already exist", 400);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.repo.createUser({
      firstName,
      lastName: lastName ?? null,
      email,
      password: hashedPassword,
      phoneNumber,
      role: role ?? "USER",
    });

    const jwtPayload = toJwtPayload(newUser);

    const accessToken = generateAccessToken(jwtPayload);

    const refreshToken = generateRefreshToken(jwtPayload);

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await this.repo.createRefreshToken({
      token: hashedRefreshToken,
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      user: toUserResponse(newUser),
      accessToken,
      refreshToken,
    };
  }

  async loginUserService(data: loginUserDTO) {
    const { email, password } = data;
    const existingUser = await this.repo.getUserByEmail(email);

    if (!existingUser) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordCorrect = await comparePassword(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      throw new AppError("Invalid credentials", 401);
    }

    const jwtPayload = toJwtPayload(existingUser);

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await this.repo.createRefreshToken({
      token: hashedRefreshToken,
      userId: existingUser.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      user: toUserResponse(existingUser),
      accessToken,
      refreshToken,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.repo.getUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return toUserResponse(user);
  }

  async logout(data: logoutUserDTO) {
    const { refreshToken } = data;

    if (!refreshToken) {
      throw new AppError("Refresh Token is required", 401);
    }

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    const existingRefreshToken =
      await this.repo.findRefreshToken(hashedRefreshToken);

    if (!existingRefreshToken) {
      throw new AppError("Invalid refresh Token", 401);
    }

    await this.repo.deleteRefreshTokenById(existingRefreshToken.id);

    return true;
  }

  async logOutAllDevices(userId: string) {
    await this.repo.deleteAllRefreshTokenByUserId(userId);
    return true;
  }

  async refreshToken(data: refreshTokenDTO) {
    const { refreshToken } = data;

    let decoded;

    try {
      decoded = verifyRefreshToken(refreshToken) as IJwtPayload;
    } catch (error) {
      throw new AppError("Invalid or expired refresh Token", 403);
    }

    const user = await this.repo.getUserById(decoded.id)

    if(!user) {
      throw new AppError("User not found", 404)
    }

    const hashedOldRefreshToken = hashRefreshToken(refreshToken);

    const existingRefreshToken = await this.repo.findRefreshToken(
      hashedOldRefreshToken,
    );

    if (!existingRefreshToken) {
      throw new AppError("Invalid refresh Token", 401);
    }

    await this.repo.deleteRefreshTokenById(existingRefreshToken.id);

    const newJwtPayload = toJwtPayload(user);

    const newAccessToken = generateAccessToken(newJwtPayload);
    const newRefreshToken = generateRefreshToken(newJwtPayload);

    const newHashedRefreshToken = hashRefreshToken(newRefreshToken);

    await this.repo.createRefreshToken({
      token: newHashedRefreshToken,
      userId: decoded.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }
}
