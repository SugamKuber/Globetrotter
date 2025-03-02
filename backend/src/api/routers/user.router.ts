import { Elysia } from "elysia";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getMe, getInviteDetails } from "../controllers/user.controller";

const userRouteDetails = {
    detail: {
        tags: ['User'],
        security: [{ bearerAuth: [] }]
    }
};

export const userRouter = (app: Elysia) => {
    return app.group("/user", (app) =>
        app.use(authMiddleware)
            .get("/me", getMe, userRouteDetails)
            .get("/invitees", getInviteDetails, userRouteDetails)
    );
}