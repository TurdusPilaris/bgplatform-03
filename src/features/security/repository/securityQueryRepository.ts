import {ObjectId, WithId} from "mongodb";
import {deviceAuthSessions} from "../../../db/mongo/mongo-db";
import {DeviceAuthSessionsType, DeviceViewModelType} from "../../../input-output-types/common/common-types";

export const securityQueryRepository = {

    async getAllSessionsForUser(userId: string):Promise<DeviceViewModelType[]>{

      const sessions = await deviceAuthSessions.find({userId: userId}).toArray();
      const AllSessions = await deviceAuthSessions.find({}).toArray();

      console.log("all session", AllSessions)
      console.log("founded session", sessions)
      console.log("current user ID", userId)

      return sessions.map(this.mapToOutput);
    },
    mapToOutput(session: WithId<DeviceAuthSessionsType>):DeviceViewModelType {
        return {
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: session.iat.toISOString(),
            deviceId: session.deviceId
        }
    },
    async getSessionByDeviceID(deviceId: string) {

    return await deviceAuthSessions.findOne({deviceId: deviceId});

}
}