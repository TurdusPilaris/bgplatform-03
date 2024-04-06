import {InsertedInfoType, PostDBMongoTypeWithoutID} from "../../../input-output-types/inputOutputTypesMongo";
import {deviceAuthSessions, postCollection} from "../../../db/mongo/mongo-db";
import {DeviceAuthSessionsType} from "../../../input-output-types/common/common-types";
import {ObjectId} from "mongodb";

export const securityMongoRepository = {
    async createSession(session: DeviceAuthSessionsType) {

        try {
            console.log("session for create ", session)
            const sessionCreated = await deviceAuthSessions.insertOne(session);
            return sessionCreated.insertedId;
        } catch (e) {
            return null;
        }
    },
    async deleteNonCurrentSessions(userId: string, currentDeviceId: string) {

        await deviceAuthSessions.deleteMany({userId: userId, deviceId: {$ne:currentDeviceId}});

    },
    async deleteCurrentSessions(userId: string, currentDeviceId: string) {

        await deviceAuthSessions.deleteMany({userId: userId, deviceId: currentDeviceId});

    },
    async deleteSessionByDeviceID(_id: ObjectId) {

        await deviceAuthSessions.deleteOne({_id: _id});

    }

}