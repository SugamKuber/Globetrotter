import { Elysia, t } from "elysia";
import { signup, login } from "../controllers/auth.controller";

export const authRouter = (app: Elysia) =>
    app.group("/auth", (app) =>
        app
            .post("/signup", signup, {
                body: t.Object({
                    name: t.String(),
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
    );