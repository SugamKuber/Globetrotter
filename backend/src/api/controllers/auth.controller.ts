import { Elysia } from "elysia";
import { User } from "../../models/User";
import { hashPassword, comparePassword } from "../../utils/helpers";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/constants";
import type { CustomJWTPayload } from "../../types/auth.types";

export const signup = async ({ body, set }: any) => {
    try {
        console.log("hehhe")
        const { name, username, password } = body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            set.status = 400;
            return { success: false, message: ERROR_MESSAGES.USER_EXISTS };
        }

        await User.create({ name, username, password });
        return { success: true, message: SUCCESS_MESSAGES.SIGNUP_SUCCESS };
    } catch (error) {
        console.log(error)
        set.status = 500;
        return { success: false, message: ERROR_MESSAGES.INTERNAL_ERROR };
    }
};

export const login = async ({ body, set, jwt }: {
    body: { username: string; password: string };
    set: any;
    jwt: { sign: (payload: CustomJWTPayload) => Promise<string> };
}) => {
    try {
        const { username, password } = body;
        const user = await User.findOne({ username }).select("+password +salt") as { _id: string, password: string, salt: string };

        if (!user) {
            set.status = 401;
            return { success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS };
        }

        const isValid = comparePassword(password, user.salt, user.password);
        if (!isValid) {
            set.status = 401;
            return { success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS };
        }

        const token = await jwt.sign({
            userId: user._id,
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
        });

        return { success: true, token, message: SUCCESS_MESSAGES.LOGIN_SUCCESS };
    } catch (error) {
        set.status = 500;
        return { success: false, message: ERROR_MESSAGES.INTERNAL_ERROR };
    }
};