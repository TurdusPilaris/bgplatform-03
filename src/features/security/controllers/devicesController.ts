import {Request, Response} from "express";
import {DeviceViewModelType} from "../../../input-output-types/common/common-types";
import {SecurityQueryRepository} from "../repository/securityQueryRepository";
import {ResultStatus} from "../../../common/types/resultCode";
import {SecurityService} from "../domain/security-service";
import {injectable} from "inversify";
@injectable()
export  class DevicesController{
    constructor(
        protected securityService: SecurityService,
        protected securityQueryRepository: SecurityQueryRepository
    ) {
    }
    async getDevicesController(req: Request<any, any, any, any>, res: Response<DeviceViewModelType[]>) {

        const devicesForUser = await this.securityQueryRepository.getAllSessionsForUser(req.userId!);
        res.status(200).send(devicesForUser);

    }
    async deleteDevicesController(req: Request<any, any, any, any>, res: Response) {

        await this.securityService.deleteNonCurrentSessions(req.userId!, req.deviceId!);

        res.sendStatus(204);
    }
    async deleteDevicesByIDController(req: Request<any, any, any, any>, res: Response) {

        const result = await this.securityService.deleteSessionByDeviceID(req.userId!, req.params.id);

        if(result.status === ResultStatus.NotFound){
            res.sendStatus(404);
            return;
        }

        if(result.status === ResultStatus.Forbidden) {
            res.sendStatus(403);
            return;
        }

        res.sendStatus(204);

    }
}