import { AppError } from "../../utils/AppError.js";
import { comparePassword, hashPassword, hashRefreshToken } from "../../utils/auth.helper.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { toJwtPayload, toUserResponse } from "./auth.mapper.js";
import { loginUserDTO, registerUserDTO } from "./auth.schema.js";

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

    const jwtPayload = toJwtPayload(newUser)

    const accessToken = generateAccessToken(jwtPayload);

    const refreshToken = generateRefreshToken(jwtPayload);

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await this.repo.createRefreshToken({
      token: hashedRefreshToken,
      userId:newUser.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })

    return {
      user: toUserResponse(newUser),
      accessToken,
      refreshToken
    }
  }

  async loginUserService (data: loginUserDTO) {
    const { email , password} = data;
    const existingUser = await this.repo.getUserByEmail(email)

    if(!existingUser) {
      throw new AppError("Invalid credentials",401)
    }

    const isPasswordCorrect = await comparePassword(password,existingUser.password)

    if(!isPasswordCorrect) {
      throw new AppError("Invalid credentials",401)
    }

    const jwtPayload = toJwtPayload(existingUser)

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    await this.repo.createRefreshToken({
      token: refreshToken,
      userId: existingUser.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })

    return {
      user: toUserResponse(existingUser),
      accessToken,
      refreshToken
    }
  }
}
