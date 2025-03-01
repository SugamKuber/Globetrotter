import { Schema, model, Document, Types } from "mongoose";

export interface IQuestion {
    _id: Types.ObjectId;
    optionsId: string[];
    correctOptionId: string;
    status: "wrong" | "correct" | "unanswered";
}

export interface IQuiz extends Document {
    _id: Types.ObjectId;
    userId: string;
    questions: IQuestion[];
    score: number;
    currentQuestion: number;
    startTime: Date;
    endTime: Date;
    isEnded: boolean;
}


const QuestionSchema = new Schema<IQuestion>({
    optionsId: { type: [String], required: true },
    correctOptionId: { type: String, required: true },
    status: { type: String, enum: ["wrong", "correct", "unanswered"], required: true },
});

const QuizSchema = new Schema<IQuiz>({
    userId: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
    score: { type: Number, required: true },
    currentQuestion: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: false },
    isEnded: { type: Boolean, required: true },
});

export const Quiz = model<IQuiz>("Quiz", QuizSchema);
