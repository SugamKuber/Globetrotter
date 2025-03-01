import { Schema, model, Document } from "mongoose";

export interface IInvite extends Document {
    inviteLink: string;
    createdAt: Date;
    inviterId: string;
}

const InviteSchema = new Schema<IInvite>({
    inviteLink: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    inviterId: { type: String, required: true }
});

export const Invite = model<IInvite>("Invite", InviteSchema);
