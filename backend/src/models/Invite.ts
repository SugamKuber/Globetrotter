import { Schema, model, Document, Types } from "mongoose";

export interface IInvite extends Document {
    inviteLink: string;
    inviterId: Types.ObjectId;
    inviteesId: Types.ObjectId[];
}

const InviteSchema = new Schema<IInvite>({
    inviteLink: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    inviterId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    inviteesId: [{
        type: Schema.Types.ObjectId,
        default: []
    }]
});

export const Invite = model<IInvite>("Invite", InviteSchema);