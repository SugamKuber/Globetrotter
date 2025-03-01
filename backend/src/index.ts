import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { config } from "./config/config";
import { connectToDB } from "./db/connection";
import { authRouter } from "./api/routers/auth.router";
import { userRouter } from "./api/routers/user.router";
import { quizRouter } from "./api/routers/quiz.router";

const app = new Elysia()
  .use(swagger())
  .use(cors())
  .group("/api", (app) =>
    app
      .use(authRouter)
      .use(userRouter)
      .use(quizRouter)
  )
  .listen(config.PORT);

connectToDB();

console.log(`🦊 Server running at ${app.server?.hostname}:${app.server?.port}`);