import { Elysia } from "elysia";

export const getMe = ({ user }: any) => {
    return { name: user.name };
};