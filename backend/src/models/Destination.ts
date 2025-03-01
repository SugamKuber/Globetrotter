import { Schema, model, Document } from "mongoose";

export interface IDestination extends Document {
    city: string;
    country: string;
    clues: string[];
    funFact: string[];
    trivia: string[];
}

const DestinationSchema = new Schema<IDestination>({
    city: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    clues: { type: [String], required: true },
    funFact: { type: [String], required: true },
    trivia: { type: [String], required: true },
});

export const Destination = model<IDestination>("Destination", DestinationSchema);
