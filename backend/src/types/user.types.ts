export interface IUser {
    _id: string;
    fullname: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserDocument extends IUser, Document { }

export interface IUserCreate {
    fullname: string;
    username: string;
    password: string;
}

export interface IUserLogin {
    username: string;
    password: string;
}

export interface IUserResponse {
    id: string;
    fullname: string;
    username: string;
    createdAt: Date;
}