import {DeviceAuthSessionsDB} from "../../../input-output-types/inputOutputTypesMongo";
import {DeviceAuthSessionsModel} from "../../../db/mongo/devicesAuthSessions/deviceAuthSession.model";

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
}