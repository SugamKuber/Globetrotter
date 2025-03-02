import type { JWTPayloadSpec } from "@elysiajs/jwt";
import { IUser } from "../models/User";

export interface CustomJWTPayload extends JWTPayloadSpec {
    userId: string;
}

export type AuthUser = Omit<IUser, 'password' | 'refreshToken'>;