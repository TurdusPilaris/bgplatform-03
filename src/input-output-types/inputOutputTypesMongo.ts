import {ObjectId} from "mongodb";

export type PostDBMongoType = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string|undefined;
    blogName: string|undefined;
    createdAt: string;
}

export type UserAccountDBType = {
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

export type CommentDBType = {
    content: string;
    postId: string;
    commentatorInfo: CommentatorInfoType,
    createdAt: string
}

export type CommentatorInfoType = {
    userId: string,
    userLogin: string
}

export class CommentDBType2 {
    constructor(public _id: ObjectId,
                public content: string,
                public postId: string,
                public commentatorInfo: CommentatorInfoType,
                public createdAt: string
    ) {   }
}