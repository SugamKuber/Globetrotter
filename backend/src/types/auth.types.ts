import type { JWTPayloadSpec } from "@elysiajs/jwt";

export interface CustomJWTPayload extends JWTPayloadSpec {
    userId: string;
}