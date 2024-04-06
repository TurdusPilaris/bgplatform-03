import {DeviceAuthSessionsType} from "../../../input-output-types/common/common-types";
import {securityMongoRepository} from "../repository/securityMongoRepository";
import {ResultObject} from "../../../common/types/result.types";
import {ResultStatus} from "../../../common/types/resultCode";
import {ObjectId} from "mongodb";
import {securityQueryRepository} from "../repository/securityQueryRepository";

export const securityService = {

    async createSession(payload: any, deviceName: string, ip: string | undefined): Promise<ResultObject<ObjectId | null>> {

        if (!ip) return {
            status: ResultStatus.BadRequest,
            errorField: 'ip',
            errorMessage: 'Not found ip',
            data: null
        };

        const session: DeviceAuthSessionsType = {
            userId: payload.userId,
            deviceId: payload.deviceId,
            iat: new Date(payload.iat * 1000),
            deviceName: deviceName,
            ip: ip,
            exp: new Date(payload.exp * 1000)
        }

        const result = await securityMongoRepository.createSession(session);

        if (!result) return {
            status: ResultStatus.InternalServerError,
            errorField: 'session',
            errorMessage: 'Cant created session',
            data: null
        }

        return {
            status: ResultStatus.Success,
            data: result
        };
    },
    async deleteNonCurrentSessions(userId: string, currentDeviceId: string) {

        await securityMongoRepository.deleteNonCurrentSessions(userId, currentDeviceId);
    },
    async deleteSessionByDeviceID(userId: string, deviceId: string): Promise<ResultObject> {

        const session = await securityQueryRepository.getSessionByDeviceID(deviceId);

        if (!session) return {
            status: ResultStatus.NotFound,
            errorField: 'devicedID',
            errorMessage: 'Not found session',
            data: null
        }

        if (session.userId !== userId) return {
            status: ResultStatus.Forbidden,
            errorField: 'userId',
            errorMessage: 'try to delete the deviceId of other user',
            data: null
        }

        try {
            await securityMongoRepository.deleteSessionByDeviceID(session._id);
        } catch (e) {
            return {
                status: ResultStatus.InternalServerError,
                errorField: 'deleteSession',
                errorMessage: 'Cant deleted session by ID',
                data: null
            }
        }

        return {
            status: ResultStatus.Success,
            data: null
        }

    },
    async dropCurrentSession(userId: string, currentDeviceId: string) {

        await securityMongoRepository.deleteCurrentSessions(userId, currentDeviceId);

    }
}

