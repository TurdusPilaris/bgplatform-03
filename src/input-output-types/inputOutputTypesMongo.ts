import {ObjectId} from "mongodb";

export type PostDBMongoType = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string | undefined;
    blogName: string | undefined;
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

// export type CommentDBType = {
//     content: string;
//     postId: string;
//     commentatorInfo: CommentatorInfoType,
//     createdAt: string
// }

export type CommentatorInfoType = {
    userId: string,
    userLogin: string
}

export class CommentDB {
    _id: ObjectId
    createdAt: string

    constructor(
        public content: string,
        public postId: string,
        public commentatorInfo: CommentatorInfoType
    ) {
        this._id = new ObjectId(),
            this.createdAt = new Date().toISOString()
    }
}

export class UserDB {
    _id: ObjectId
    constructor(
        public accountData: AccountDataType,
        public emailConfirmation: EmailConfirmationType
    ) {
        this._id = new ObjectId()
    }
}