import { RefreshToken, Role, User } from "@prisma/client";

export interface IAuthRepository {
  getUserByEmail(email: string): Promise<User | null>;
  createUser(data: {
    firstName: string;
    lastName?: string | null;
    email: string;
    password: string;
    phoneNumber: string;
    role: Role;
  }): Promise<User>;
  createRefreshToken(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken>;
  getUserById(userId: string): Promise<User | null>;
  findRefreshToken(hashedRefreshToken: string): Promise<RefreshToken | null>
  deleteRefreshTokenById(refreshTokenById: string): Promise<void>
  deleteAllRefreshTokenByUserId(userId: string): Promise<void>
}
