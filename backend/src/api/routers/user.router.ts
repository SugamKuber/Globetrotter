import { Elysia } from "elysia";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getMe } from "../controllers/user.controller";

export const userRouter = (app: Elysia) =>
    app.group("/user", (app) =>
        app
            .use(authMiddleware)
            .get("/me", getMe)
    );