import { User } from "../../models/User";
import { Invite } from "../../models/Invite";

export const getMe = async ({ user }: any) => {
    const [invite, userData] = await Promise.all([
        Invite.findOne({ inviterId: user._id.toString() }, 'inviteLink'),
        User.findById(user._id)
    ]);

    if (!invite || !userData) {
        throw new Error(`${!invite ? 'Invite' : 'User'} not found`);
    }

    return {
        username: userData.username,
        fullname: userData.fullname,
        inviteLink: invite.inviteLink,
        highestScore: userData.highestScore
    };
};


export const getInviteDetails = async ({ user }: any) => {
    const invite = await Invite.findOne({ inviterId: user._id.toString() });
    if (!invite) throw new Error("Invite not found");

    const invitees = await User.find({ _id: { $in: invite.inviteesId } }, 'fullname highestScore');
    return { inviteDetails: invitees.map(({ _id, fullname, highestScore }: any) => ({ id: _id, name: fullname, highestScore })) };
};
