import {ObjectId} from "mongodb";

export type PostDBMongoType = {
    _id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string|undefined;
    blogName: string|undefined;
    createdAt: string;
}
export type PostDBMongoTypeWithoutID = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string|undefined;
    blogName: string|undefined;
    createdAt: string;
}

export type UserDBMongoTypeWithoutID = {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
}

export type UserDBMongoType = {
    _id: ObjectId;
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
}

export type UserAccountDBMongoType = {
    _id: ObjectId;
    accountData: AccountDataType;
    emailConfirmation: EmailConfirmationType;
}

export type AccountDataType = {
    userName: string;
    email: string;
    passwordHash: string;
    createdAt: string;
}

export type EmailConfirmationType = {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
}
export type BlogDBMongoType = {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}

export type InsertedInfoType = {
    "acknowledged": boolean,
    "insertedId": ObjectId
}

export type CommentDBMongoTypeWithoutID = {

    content: string;
    postId: string;
    commentatorInfo: CommentatorInfoType,
    createdAt: string;
}

export type CommentDBMongoType = {
    _id: ObjectId;
    content: string;
    postId: string;
    commentatorInfo: CommentatorInfoType,
    createdAt: string
}

export type CommentatorInfoType = {
    userId: string,
    userLogin: string
}

export type BlackListDBMongoType = {
    _id: ObjectId;
    refreshToken: string;
    userId: string;
}