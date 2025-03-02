import { Elysia, t } from "elysia";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { start, submit, next, status, restart, end, history } from "../controllers/quiz.controller";

const routeDetail = {
    detail: {
        tags: ['Quiz'],
        security: [{ bearerAuth: [] }]
    }
};

export const quizRouter = (app: Elysia) => {
    app.group("/quiz", (app) =>
        app.use(authMiddleware)
            .get("/start", start, routeDetail)
            .post("/submit", submit, {
                body: t.Object({
                    questionId: t.String(),
                    answerId: t.String(),
                }), ...routeDetail
            })
            .get("/next", next, routeDetail)
            .get("/restart", restart, routeDetail)
            .get("/end", end, routeDetail)
            .get("/status", status, routeDetail)
            .get("/history", history, routeDetail)
    );
}