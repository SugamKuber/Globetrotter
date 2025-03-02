import { User } from "../../models/User";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/constants";
import type { CustomJWTPayload } from "../../types/auth.types";
import { Invite } from "../../models/Invite";
import { Types } from "mongoose";
import { config } from "../../config/config";

export const signup = async ({ body, set, jwt }: {
    body: { fullname: string; username: string; password: string, ref?: string };
    set: { status: number };
    jwt: {
        sign: (payload: CustomJWTPayload) => Promise<string>;
    };
}): Promise<{ success: boolean; message: string }> => {
    try {
        const { fullname, username, password, ref } = body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            set.status = 400;
            return { success: false, message: ERROR_MESSAGES.USER_EXISTS };
        }

        const hashedPassword = await Bun.password.hash(password);

        const refreshToken = await jwt.sign({
            userId: username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days expiry
        });

        const user = await User.create({ fullname, username, password: hashedPassword, refreshToken });

        const invite = new Invite({
            inviterId: user._id,
            inviteLink: `${config.FRONTEND_URL}/signup?ref=${user._id.toString()}`,
        });

        await invite.save();

        if (ref) {
            const referrer = await Invite.findOne({ inviterId: new Types.ObjectId(ref) });
            if (referrer) {
                referrer.inviteesId.push(user._id);
                await referrer.save();
            }
        }

        return { success: true, message: SUCCESS_MESSAGES.SIGNUP_SUCCESS };
    } catch (error) {
        console.error(error);
        set.status = 500;
        return { success: false, message: ERROR_MESSAGES.INTERNAL_ERROR };
    }
};


export const login = async ({ body, set, jwt }: {
    body: { username: string; password: string };
    set: { status: number };
    jwt: { sign: (payload: CustomJWTPayload) => Promise<string> };
}): Promise<{ success: boolean; accessToken?: string; refreshToken?: string; message: string }> => {
    try {
        const { username, password } = body;

        const user = await User.findOne({ username }).select("+password +refreshToken");
        if (!user) {
            set.status = 401;
            return { success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS };
        }

        const isValid = await Bun.password.verify(password, user.password);
        if (!isValid) {
            set.status = 401;
            return { success: false, message: ERROR_MESSAGES.INVALID_CREDENTIALS };
        }

        const accessToken = await jwt.sign({
            userId: user._id.toString(),
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
        });

        const refreshToken = await jwt.sign({
            userId: user._id.toString(),
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days expiry
        });

        user.refreshToken = refreshToken;
        await user.save();

        return { success: true, accessToken, refreshToken, message: SUCCESS_MESSAGES.LOGIN_SUCCESS };
    } catch (error) {
        console.error(error);
        set.status = 500;
        return { success: false, message: ERROR_MESSAGES.INTERNAL_ERROR };
    }
};

export const refreshToken = async ({ body, set, jwt }: {
    body: { refreshToken: string };
    set: { status: number };
    jwt: {
        verify: (token: string) => Promise<CustomJWTPayload>
        sign: (payload: CustomJWTPayload) => Promise<string>;
    };
}): Promise<{ success: boolean; accessToken?: string; message: string }> => {
    try {
        const { refreshToken } = body;

        const payload = await jwt.verify(refreshToken);
        if (!payload || !payload.userId) {
            set.status = 401;
            return { success: false, message: ERROR_MESSAGES.UNAUTHORIZED };
        }

        const user = await User.findOne({ _id: payload.userId }).select("+refreshToken");
        if (!user || user.refreshToken !== refreshToken) {
            set.status = 401;
            return { success: false, message: ERROR_MESSAGES.UNAUTHORIZED };
        }

        const newAccessToken = await jwt.sign({
            userId: user._id.toString(),
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
        });

        return { success: true, accessToken: newAccessToken, message: "refresh successfully" };
    } catch (error) {
        console.error(error);
        set.status = 500;
        return { success: false, message: ERROR_MESSAGES.INTERNAL_ERROR };
    }
};
