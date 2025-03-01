import { Elysia, t } from "elysia";
import { signup, login, refreshToken } from "../controllers/auth.controller";

export const authRouter = (app: Elysia) =>
    app.group("/auth", (app) =>
        app
            .post("/signup", signup, {
                body: t.Object({
                    fullname: t.String(),
                    username: t.String(),
                    password: t.String(),
                }),
            })
            .post("/login", login, {
                body: t.Object({
                    username: t.String(),
                    password: t.String(),
                }),
            })
            .post("/refresh", refreshToken, {
                body: t.Object({
                    refreshToken: t.String(),
                }),
            })
    );
