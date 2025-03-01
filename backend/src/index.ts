import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { serverTiming } from '@elysiajs/server-timing'
import { cors } from "@elysiajs/cors";
import { config } from "./config/config";
import { connectToDB } from "./db/connection";
import { authRouter } from "./api/routers/auth.router";
import { userRouter } from "./api/routers/user.router";
import { quizRouter } from "./api/routers/quiz.router";

const app = new Elysia()
  .use(swagger({
    path: "/swagger",
    documentation: {
      info: {
        title: 'Globetrotter API Doc',
        version: '1.0.0',
      },
      tags: [
        { name: 'User', description: 'User endpoints' },
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Quiz', description: 'Quiz endpoints' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  }))
  .use(cors({
    origin: config.FRONTEND_URL || '*'
  }))
  .use(serverTiming())
  .group("/api", (app) =>
    app
      .use(authRouter)
      .use(userRouter)
      .use(quizRouter)
  )
  .get("/h", () => { return { status: "OK" } })
  .listen(config.PORT);

connectToDB();

console.log(`🦊 Server running at ${app.server?.hostname}:${app.server?.port}`);