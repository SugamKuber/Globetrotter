export const config = {
  PORT: Bun.env.PORT || 3000,
  JWT_SECRET: Bun.env.JWT_SECRET || "your_jwt_secret_here",
  MONGODB_URI: Bun.env.MONGODB_URI || "mongodb://localhost:27017/mydb",
  FRONTEND_URL: Bun.env.FRONTEND_URL || "http://localhost:5173"
};