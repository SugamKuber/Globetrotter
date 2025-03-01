import { Elysia } from "elysia";

export const getMe = ({ user }: any) => {
    return { fullname: user.fullname };
};