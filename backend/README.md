# Globetrotter Backend

## Overview

This is the backend for the Globetrotter application.

## API Endpoints

### Authentication

- **POST /api/auth/signup**
  - Description: Register a new user.
  - Request Body:
    ```json
    {
      "fullname": "string",
      "username": "string",
      "password": "string",
      "ref": "string (optional)"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "message": "User created successfully"
    }
    ```

- **POST /api/auth/login**
  - Description: Log in an existing user.
  - Request Body:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "accessToken": "JWT token",
      "refreshToken": "JWT token",
      "message": "Login successful"
    }
    ```

- **POST /api/auth/refresh**
  - Description: Refresh the access token using the refresh token.
  - Request Body:
    ```json
    {
      "refreshToken": "string"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "accessToken": "new JWT token"
    }
    ```

### User

- **GET /api/user/me**
  - Description: Get the user's profile information.
  - Response:
    ```json
    {
      "username": "string",
      "fullname": "string",
      "inviteLink": "string",
      "highestScore": "number"
    }
    ```

- **GET /api/user/invitees**
  - Description: Get the list of invitees.
  - Response:
    ```json
    {
      "inviteDetails": [
        {
          "id": "string",
          "name": "string",
          "highestScore": "number"
        }
      ]
    }
    ```

### Quiz

- **GET /api/quiz/start**
  - Description: Start a new quiz.
  - Response:
    ```json
    {
      "clues": ["string"],
      "options": [
        {
          "city": "string",
          "country": "string",
          "id": "string"
        }
      ],
      "score": 0,
      "questionId": "string"
    }
    ```

- **POST /api/quiz/submit**
  - Description: Submit an answer for a quiz question.
  - Request Body:
    ```json
    {
      "questionId": "string",
      "answerId": "string"
    }
    ```
  - Response:
    ```json
    {
      "message": "Answer submitted",
      "score": "number",
      "status": "correct" | "wrong",
      "funFact": "string",
      "trivia": "string"
    }
    ```

- **GET /api/quiz/next**
  - Description: Fetch the next quiz question.
  - Response:
    ```json
    {
      "clues": ["string"],
      "options": [
        {
          "city": "string",
          "country": "string",
          "id": "string"
        }
      ],
      "score": "number",
      "questionId": "string"
    }
    ```

- **GET /api/quiz/end**
  - Description: End the current quiz.
  - Response:
    ```json
    {
      "message": "Quiz ended successfully",
      "score": "number",
      "correctQuestions": "number",
      "wrongQuestions": "number"
    }
    ```

- **GET /api/quiz/restart**
  - Description: Restart the quiz.
  - Response:
    ```json
    {
      "message": "Quiz restarted successfully",
      "clues": ["string"],
      "options": [
        {
          "city": "string",
          "country": "string",
          "id": "string"
        }
      ],
      "score": 0,
      "questionId": "string"
    }
    ```

- **GET /api/quiz/status**
  - Description: Get the current quiz status.
  - Response:
    ```json
    {
      "message": "Current quiz status",
      "score": "number",
      "currentQuestion": "number",
      "totalQuestions": "number",
      "questions": [
        {
          "questionId": "string",
          "status": "correct" | "wrong" | "unanswered",
          "correctOptionId": "string",
          "optionsId": ["string"]
        }
      ]
    }
    ```

- **GET /api/quiz/history**
  - Description: Get the quiz history.
  - Response:
    ```json
    {
      "message": "Quiz history",
      "quizzes": [
        {
          "quizId": "string",
          "score": "number",
          "startTime": "date",
          "endTime": "date",
          "totalQuestions": "number",
          "correctQuestions": "number",
          "wrongQuestions": "number",
          "questions": [
            {
              "questionId": "string",
              "status": "correct" | "wrong" | "unanswered",
              "correctOptionId": "string",
              "optionsId": ["string"]
            }
          ]
        }
      ]
    }
    ```

## Running the Application

1. Start the backend server:
    ```sh
    cd backend
    bun run dev
    ```

2. Start the frontend development server:
    ```sh
    cd ../frontend
    npm run dev
    ```

3. Open your browser and go to `http://localhost:5173`.


### Environment Variables

Ensure the following environment variables are set in the `docker-compose.yml` file:

```
PORT=3000
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=mongodb://mongo:27017/globetrotter
FRONTEND_URL=http://localhost:5173
```