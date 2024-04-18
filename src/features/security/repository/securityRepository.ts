import {DeviceAuthSessionsDB} from "../../../input-output-types/inputOutputTypesMongo";
import {DeviceAuthSessionsModel} from "../../../db/mongo/devicesAuthSessions/deviceAuthSession.model";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
@injectable()
export class SecurityRepository{
    async createSession(session: DeviceAuthSessionsDB) {

        try {
            let newSession = new DeviceAuthSessionsModel(session);
            await newSession.save();
            return newSession._id;
        } catch (e) {
            return null;
        }
    }
    async deleteNonCurrentSessions(userId: string, currentDeviceId: string) {

        await DeviceAuthSessionsModel.deleteMany({userId: userId, deviceId: {$ne:currentDeviceId}});

    }

    async deleteCurrentSessions(userId: string, currentDeviceId: string) {

        await DeviceAuthSessionsModel.deleteMany({userId: userId, deviceId: currentDeviceId});

    }
    async deleteSessionByDeviceID(_id: ObjectId) {

        await DeviceAuthSessionsModel.deleteOne({_id: _id});

    }
}