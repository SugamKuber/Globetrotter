import { Elysia } from "elysia";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getMe, getInviteDetails } from "../controllers/user.controller";

export const userRouter = (app: Elysia) =>
    app.group("/user", (app) =>
        app
            .use(authMiddleware)
            .get("/me", getMe, {
                detail: {
                    tags: ['User'],
                    security: [
                        {
                            bearerAuth: []
                        }
                    ]
                }
            })
            .get("/invitees", getInviteDetails, {
                detail: {
                    tags: ['User'],
                    security: [
                        {
                            bearerAuth: []
                        }
                    ]
                }
            })
    );