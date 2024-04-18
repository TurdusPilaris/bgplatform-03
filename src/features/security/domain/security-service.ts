import {ResultObject} from "../../../common/types/result.types";
import {ResultStatus} from "../../../common/types/resultCode";
import {ObjectId} from "mongodb";
import {SecurityQueryRepository} from "../repository/securityQueryRepository";
import {DeviceAuthSessionsDB} from "../../../input-output-types/inputOutputTypesMongo";
import {SecurityRepository} from "../repository/securityRepository";
import {injectable} from "inversify";
@injectable()
export class SecurityService{

    constructor(
        protected securityQueryRepository: SecurityQueryRepository,
        protected securityRepository: SecurityRepository
    ) {
    }
    async createSession(payload: any, deviceName: string, ip: string | undefined): Promise<ResultObject<ObjectId | null>> {

        if (!ip) return {
            status: ResultStatus.BadRequest,
            errorField: 'ip',
            errorMessage: 'Not found ip',
            data: null
        };

        const session = new DeviceAuthSessionsDB(
                payload.userId,
                payload.deviceId,
                new Date(payload.iat * 1000),
                deviceName,
                ip,
                new Date(payload.exp * 1000)
        )


        const result = await this.securityRepository.createSession(session);

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
    }
    async deleteNonCurrentSessions(userId: string, currentDeviceId: string) {

        await this.securityRepository.deleteNonCurrentSessions(userId, currentDeviceId);
    }
    async deleteSessionByDeviceID(userId: string, deviceId: string): Promise<ResultObject> {

        const session = await this.securityQueryRepository.getSessionByDeviceID(deviceId);

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
            await this.securityRepository.deleteSessionByDeviceID(session._id);
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

    }
    async dropCurrentSession(userId: string, currentDeviceId: string) {

        await this.securityRepository.deleteCurrentSessions(userId, currentDeviceId);

    }
}
