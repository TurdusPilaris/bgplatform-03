import {ObjectId} from "mongodb";

export type CustomRateLimitType = {
    IP: string|undefined;
    URL: string;
    date: Date;
}

export type DeviceAuthSessionsType = {
    userId: string;
    deviceId: string;
    iat: Date;
    deviceName: string;
    ip: string;
    exp: Date;
}

export type PayloadTokenType = {
    userId: ObjectId;
    deviceId?: string|null;
}

export type DeviceViewModelType = {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;
}