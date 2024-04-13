export type DeviceAuthSessionsType = {
    userId: string;
    deviceId: string;
    iat: Date;
    deviceName: string;
    ip: string;
    exp: Date;
}

import {WithId} from "mongodb";
import {HydratedDocument, model, Model, Schema} from "mongoose";
import {DeviceAuthSessionsDB} from "../../../input-output-types/inputOutputTypesMongo";

type DeviceAuthSessionsModel = Model<WithId<DeviceAuthSessionsDB>>;

export type DeviceAuthSessionsDocument = HydratedDocument<WithId<DeviceAuthSessionsDB>>;

export const DeviceAuthSessionsSchema = new Schema<WithId<DeviceAuthSessionsDB>>({
    userId: {type: String},
    deviceId: {type: String},
    iat: {type: Date},
    deviceName: {type: String},
    ip: {type: String},
    exp: {type: Date}

})

export const DeviceAuthSessionsModel = model<WithId<DeviceAuthSessionsDB>, DeviceAuthSessionsModel>('sessions', DeviceAuthSessionsSchema)
