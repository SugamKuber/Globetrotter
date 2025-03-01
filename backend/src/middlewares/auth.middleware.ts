import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import { User } from "../models/User";
import { config } from "../config/config";
import { ERROR_MESSAGES } from "../constants/constants";

export const authMiddleware = (app: Elysia) =>
    app
        .use(bearer())
        .use(
            jwt({
                name: "jwt",
                secret: config.JWT_SECRET,
                sign: true,
            })
        )
        .derive(async ({ jwt, bearer, set }) => {
            if (!bearer) {
                set.status = 401;
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            const payload = await jwt.verify(bearer);
            if (!payload || !payload.userId) {
                set.status = 401;
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            const user = await User.findById(payload.userId).select("-password -refreshToken");
            if (!user) {
                set.status = 401;
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            return { user };
        });
