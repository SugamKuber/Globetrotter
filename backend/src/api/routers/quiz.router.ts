import { Elysia, t } from "elysia";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { start, submit, next, status, restart, end, history } from "../controllers/quiz.controller";

export const quizRouter = (app: Elysia) =>
    app.group("/quiz", (app) =>
        app.use(authMiddleware)
            .get("/start", start)
            .post(
                "/submit",
                submit,
                {
                    body: t.Object({
                        questionId: t.String(),
                        answerId: t.String(),
                    }),
                }
            )
            .get("/next", next)
            .get("restart", restart)
            .get("/end", end)
            .get("/status", status)
            .get("/history", history)
    );