import {Request, Response} from "express";
import {DeviceViewModelType} from "../../../input-output-types/common/common-types";
import {securityQueryRepository} from "../repository/securityQueryRepository";
import {ObjectId} from "mongodb";

export const getDevicesController = async (req: Request<any, any, any, any>, res: Response<DeviceViewModelType[]>) => {

    const devicesForUser = await securityQueryRepository.getAllSessionsForUser(req.userId!);
    res.status(200).send(devicesForUser);

}