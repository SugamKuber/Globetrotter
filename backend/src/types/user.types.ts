export interface IUser {
    _id: string;
    name: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserCreate {
    name: string;
    username: string;
    password: string;
}

export interface IUserLogin {
    username: string;
    password: string;
}

export interface IUserResponse {
    id: string;
    name: string;
    username: string;
    createdAt: Date;
}