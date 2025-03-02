# Globetrotter

## Overview

Globetrotter is a web application that allows users to participate in quizzes about various global destinations.

---
Hackers I know .env is not hidden, Good Luck stealing it for nothing !

Check out backend url "/swagger" endpoint and backend/README.md file for API docs

## Features

- **User Authentication**: Sign up, log in, and log out functionality.
- **Quiz System**: Start, submit answers, fetch next questions, and end quizzes.
- **Invite System**: Generate invite links and track invitees.
- **User Profile**: View user profile and highest score.

## Technologies Used

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Elysia (Bun runtime)
- MongoDB (Mongoose)
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js
- Bun
- MongoDB

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/SugamKuber/Globetrotter.git
    cd Globetrotter
    ```

2. Install dependencies for the backend:
    ```sh
    cd backend
    bun install
    ```

3. Install dependencies for the frontend:
    ```sh
    cd ../frontend
    npm install
    ```

## Project Structure

### Frontend

```
frontend/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── public/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Backend

```
backend/
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   ├── routers/
│   ├── config/
│   ├── constants/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── types/
│   ├── utils/
│   └── index.ts
├── .env
├── package.json
├── tsconfig.json
└── .gitignore
```

## TODO

- Write test cases
- Dockerize the application
- Set up CI/CD configuration files
- Fix minor bugs
- Security improvements
- Optimize backend with caching
- Implement quiz and user analytics
- Full screen lock in quiz