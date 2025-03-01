import { Elysia } from "elysia";
import { User } from "../../models/User";
import { Destination } from "../../models/Destination";
import { IQuestion, Quiz } from "../../models/Quiz";
import { Types } from "mongoose";

export const start = async ({ user, set }: { user: any, set: any }) => {
    try {
        const existingQuiz = await Quiz.findOne({ userId: user._id, isEnded: false });

        if (existingQuiz) {
            set.status = 400;
            return { message: "You cannot start a new quiz until the current quiz has ended" };
        }

        const destinations = await Destination.aggregate([{ $sample: { size: 4 } }]);

        if (destinations.length < 4) {
            set.status = 404;
            return { message: "Not enough destinations" };
        }

        const correct = destinations[0];
        const clues = correct.clues.slice(0, 2);

        const quiz = new Quiz({
            userId: user._id,
            questions: [{
                optionsId: destinations.map(dest => dest._id.toString()),
                correctOptionId: correct._id.toString(),
                status: "unanswered",
            }],
            score: 0,
            currentQuestion: 1,
            startTime: new Date(),
            endTime: null,
            isEnded: false,
        });

        await quiz.save();

        const options = destinations.map((dest) => ({
            city: dest.city,
            country: dest.country,
            id: dest._id.toString(),
        }));

        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        return {
            clues,
            options,
            score: 0,
            questionId: quiz.questions[0]._id.toString(),
        };

    } catch (error) {
        set.status = 500;
        return { message: "Failed to start quiz", error: (error as Error).message };
    }
};

export const end = async ({ user, set }: { user: any, set: any }) => {
    try {
        const quiz = await Quiz.findOne({ userId: user._id, isEnded: false });

        if (!quiz) {
            set.status = 404;
            return { message: "No active quiz found" };
        }

        quiz.isEnded = true;
        quiz.endTime = new Date();
        await quiz.save();

        return {
            message: "Quiz ended successfully",
            score: quiz.score,
            correctQuestions: quiz.questions.filter(q => q.status === "correct").length,
            wrongQuestions: quiz.questions.filter(q => q.status === "wrong").length
        };

    } catch (error) {
        set.status = 500;
        return { message: "Failed to end quiz", error: (error as Error).message };
    }
};
export const restart = async ({ user, set }: { user: any, set: any }) => {
    try {
        const quiz = await Quiz.findOne({ userId: user._id, isEnded: false });

        if (quiz) {
            quiz.isEnded = true;
            quiz.endTime = new Date();
            await quiz.save();
        }

        const destinations = await Destination.aggregate([{ $sample: { size: 4 } }]);

        if (destinations.length === 0) {
            set.status = 404;
            return { message: "No destinations found" };
        }

        const correct = destinations[0];
        const clues = correct.clues.slice(0, 2);

        const newQuiz = new Quiz({
            userId: user._id,
            questions: [{
                optionsId: destinations.map(dest => dest._id.toString()),
                correctOptionId: correct._id.toString(),
                status: "unanswered",
            }],
            score: 0,
            currentQuestion: 1,
            startTime: new Date(),
            endTime: null,
            isEnded: false,
        });

        await newQuiz.save();

        const options = destinations.map((dest) => ({
            city: dest.city,
            country: dest.country,
            id: dest._id.toString(),
        }));

        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        return {
            message: "Quiz restarted successfully",
            clues,
            options,
            score: 0,
            questionId: newQuiz.questions[0]._id.toString(),
        };

    } catch (error) {
        set.status = 500;
        return { message: "Failed to restart quiz", error: (error as Error).message };
    }
};

export const submit = async ({ user, set, body }: { user: any, set: any, body: any }) => {
    const { questionId, answerId } = body;

    try {
        const quiz = await Quiz.findOne({ userId: user._id, isEnded: false });

        if (!quiz) {
            set.status = 404;
            return { message: "Quiz not found" };
        }

        const question = quiz.questions.find(q => q._id.toString() === questionId);

        if (!question) {
            set.status = 404;
            return { message: "Question not found" };
        }

        if (question.status !== "unanswered") {
            set.status = 400;
            return { message: "Question already answered" };
        }

        if (!question.optionsId.includes(answerId)) {
            set.status = 400;
            return { message: "Invalid answer ID" };
        }

        if (question.correctOptionId === answerId) {
            question.status = "correct";
            quiz.score += 10;
        } else {
            question.status = "wrong";
            quiz.score -= 20;
        }

        await quiz.save();

        const destination = await Destination.findById(question.correctOptionId);

        if (!destination) {
            set.status = 404;
            return { message: "Destination not found" };
        }

        const funFact = destination.funFact[Math.floor(Math.random() * destination.funFact.length)];
        const trivia = destination.trivia[Math.floor(Math.random() * destination.trivia.length)];

        const userRecord = await User.findById(user._id);
        if (!userRecord) {
            set.status = 404;
            return { message: "User not found" };
        }

        if (quiz.score > userRecord.highestScore) {
            userRecord.highestScore = quiz.score;
            await userRecord.save();
        }

        return {
            message: "Answer submitted",
            score: quiz.score,
            status: question.status,
            funFact,
            trivia
        };

    } catch (error) {
        set.status = 500;
        return { message: "Failed to submit quiz", error: (error as Error).message };
    }
};

export const next = async ({ user, set }: { user: any, set: any }) => {
    try {
        const quiz = await Quiz.findOne({ userId: user._id, isEnded: false });

        if (!quiz) {
            set.status = 404;
            return { message: "Quiz not found" };
        }

        const usedCorrectIds = Array.from(new Set(quiz.questions.map(q => q.correctOptionId.toString())));
        const usedCorrectObjectIds: Types.ObjectId[] = usedCorrectIds.map((id: string) => new Types.ObjectId(id));

        const correctDestinations = await Destination.aggregate([
            { $match: { _id: { $nin: usedCorrectObjectIds } } },
            { $sample: { size: 1 } }
        ]);

        if (correctDestinations.length === 0) {
            quiz.isEnded = true;
            quiz.endTime = new Date();
            await quiz.save();
            const timeTaken = (quiz.endTime.getTime() - quiz.startTime.getTime()) / 1000; // time in seconds
            return {
                message: "Quiz has ended",
                score: quiz.score,
                correctQuestions: quiz.questions.filter(q => q.status === "correct").length,
                wrongQuestions: quiz.questions.filter(q => q.status === "wrong").length,
                timeTaken
            };
        }

        const correct = correctDestinations[0];

        const otherDestinations = await Destination.aggregate([
            { $match: { _id: { $ne: correct._id } } },
            { $sample: { size: 3 } }
        ]);

        if (otherDestinations.length < 3) {
            quiz.isEnded = true;
            quiz.endTime = new Date();
            await quiz.save();
            return {
                message: "Quiz has ended",
                score: quiz.score,
                correctQuestions: quiz.questions.filter(q => q.status === "correct").length,
                wrongQuestions: quiz.questions.filter(q => q.status === "wrong").length
            };
        }

        const optionsDestinations = [correct, ...otherDestinations];
        for (let i = optionsDestinations.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optionsDestinations[i], optionsDestinations[j]] = [optionsDestinations[j], optionsDestinations[i]];
        }

        const newQuestion: IQuestion = {
            _id: new Types.ObjectId(),
            optionsId: optionsDestinations.map(dest => dest._id.toString()),
            correctOptionId: correct._id.toString(),
            status: "unanswered",
        };

        quiz.questions.push(newQuestion);
        quiz.currentQuestion += 1;
        await quiz.save();

        const options = optionsDestinations.map((dest) => ({
            city: dest.city,
            country: dest.country,
            id: dest._id.toString(),
        }));

        return {
            clues: correct.clues.slice(0, 2),
            options,
            score: quiz.score,
            questionId: newQuestion._id.toString(),
        };

    } catch (error) {
        set.status = 500;
        return { message: "Failed to get next question", error: (error as Error).message };
    }
};

export const status = async ({ user, set }: { user: any, set: any }) => {
    try {
        const quiz = await Quiz.findOne({ userId: user._id, isEnded: false });

        if (!quiz) {
            set.status = 404;
            return { message: "No active quiz found" };
        }

        return {
            message: "Current quiz status",
            score: quiz.score,
            currentQuestion: quiz.currentQuestion,
            totalQuestions: quiz.questions.length,
            questions: quiz.questions.map(q => ({
                questionId: q._id.toString(),
                status: q.status,
                correctOptionId: q.correctOptionId,
                optionsId: q.optionsId,
            })),
        };

    } catch (error) {
        set.status = 500;
        return { message: "Failed to get quiz status", error: (error as Error).message };
    }
};

export const history = async ({ user, set }: { user: any, set: any }) => {
    try {
        const quizzes = await Quiz.find({ userId: user._id, isEnded: true });

        if (quizzes.length === 0) {
            set.status = 404;
            return { message: "No quiz history found" };
        }

        return {
            message: "Quiz history",
            quizzes: quizzes.map(quiz => ({
                quizId: quiz._id.toString(),
                score: quiz.score,
                startTime: quiz.startTime,
                endTime: quiz.endTime,
                totalQuestions: quiz.questions.length,
                correctQuestions: quiz.questions.filter(q => q.status === "correct").length,
                wrongQuestions: quiz.questions.filter(q => q.status === "wrong").length,
                questions: quiz.questions.map(q => ({
                    questionId: q._id.toString(),
                    status: q.status,
                    correctOptionId: q.correctOptionId,
                    optionsId: q.optionsId,
                })),
            })),
        };

    } catch (error) {
        set.status = 500;
        return { message: "Failed to get quiz history", error: (error as Error).message };
    }
};






















