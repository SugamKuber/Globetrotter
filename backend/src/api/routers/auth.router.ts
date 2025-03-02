import { Elysia, t } from "elysia";
import { signup, login, refreshToken } from "../controllers/auth.controller";

export const authRouter = (app: Elysia) => {
    app.group("/auth", (app) =>
        app
            .post("/signup", signup, {
                body: t.Object({
                    fullname: t.String(),
                    username: t.String(),
                    password: t.String(),
                    ref: t.Optional(t.String()),
                }), detail: { tags: ['App'] }
            })
            .post("/login", login, {
                body: t.Object({
                    username: t.String(),
                    password: t.String(),
                }), detail: { tags: ['App'] }
            })
            .post("/refresh", refreshToken, {
                body: t.Object({ refreshToken: t.String() }),
                detail: { tags: ['App'] }
            })
    );
}