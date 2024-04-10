import {Request, Response} from "express";
import {DeviceViewModelType} from "../../../input-output-types/common/common-types";
import {securityQueryRepository} from "../repository/securityQueryRepository";
import {securityService} from "../domain/security-service";
import {ResultStatus} from "../../../common/types/resultCode";

export  class DevicesController{
    async getDevicesController(req: Request<any, any, any, any>, res: Response<DeviceViewModelType[]>) {

        const devicesForUser = await securityQueryRepository.getAllSessionsForUser(req.userId!);
        res.status(200).send(devicesForUser);

    }
    async deleteDevicesController(req: Request<any, any, any, any>, res: Response) {

        await securityService.deleteNonCurrentSessions(req.userId!, req.deviceId!);

        res.sendStatus(204);
    }
    async deleteDevicesByIDController(req: Request<any, any, any, any>, res: Response) {

        const result = await securityService.deleteSessionByDeviceID(req.userId!, req.params.id);

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