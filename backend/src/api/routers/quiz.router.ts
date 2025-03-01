import { Elysia, t } from "elysia";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { start, submit, next, status, restart, end, history } from "../controllers/quiz.controller";

export const quizRouter = (app: Elysia) =>
    app.group("/quiz", (app) =>
        app.use(authMiddleware)
            .get("/start", start, {
                detail: {
                    tags: ['Quiz'],
                    security: [
                        {
                            bearerAuth: []
                        }
                    ]
                }
            })
            .post(
                "/submit",
                submit,
                {
                    body: t.Object({
                        questionId: t.String(),
                        answerId: t.String(),
                    }),
                    detail: {
                        tags: ['Quiz'],
                        security: [
                            {
                                bearerAuth: []
                            }
                        ]
                    }
                }
            )
            .get("/next", next, {
                detail: {
                    tags: ['Quiz'],
                    security: [
                        {
                            bearerAuth: []
                        }
                    ]
                }
            })
            .get("/restart", restart, {
                detail: {
                    tags: ['Quiz'],
                    security: [
                        {
                            bearerAuth: []
                        }
                    ]
                }
            })
            .get("/end", end, {
                detail: {
                    tags: ['Quiz'],
                    security: [
                        {
                            bearerAuth: []
                        }
                    ]
                }
            })
            .get("/status", status, {
                detail: {
                    tags: ['Quiz'],
                    security: [
                        {
                            bearerAuth: []
                        }
                    ]
                }
            })
            .get("/history", history, {
                detail: {
                    tags: ['Quiz'],
                    security: [
                        {
                            bearerAuth: []
                        }
                    ]
                }
            })
    );