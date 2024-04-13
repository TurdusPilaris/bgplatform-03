import {WithId} from "mongodb";
import {DeviceAuthSessionsType, DeviceViewModelType} from "../../../input-output-types/common/common-types";
import {DeviceAuthSessionsModel} from "../../../db/mongo/devicesAuthSessions/deviceAuthSession.model";

export class SecurityQueryRepository {

    async getAllSessionsForUser(userId: string): Promise<DeviceViewModelType[]> {

        const sessions = await DeviceAuthSessionsModel.find({userId: userId}).lean();
        const AllSessions = await DeviceAuthSessionsModel.find({}).lean();

        console.log("all session", AllSessions)
        console.log("founded session", sessions)
        console.log("current user ID", userId)

        return sessions.map(this.mapToOutput);
    }

    mapToOutput(session: WithId<DeviceAuthSessionsType>): DeviceViewModelType {
        return {
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: session.iat.toISOString(),
            deviceId: session.deviceId
        }
    }

    async getSessionByDeviceID(deviceId: string) {

        return DeviceAuthSessionsModel.findOne({deviceId: deviceId});

    }
}