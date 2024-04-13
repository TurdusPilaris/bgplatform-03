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



export class DeviceAuthSessionsDB {
    constructor(
        public userId: string,
        public deviceId: string,
        public iat: Date,
        public deviceName: string,
        public ip: string,
        public exp: Date,
    ) {
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

export class CustomRateLimitDB{
    _id: ObjectId
    constructor(
       public IP: string,
       public URL: string,
       public date: Date
    ) {
        this._id = new ObjectId()
    }
}



