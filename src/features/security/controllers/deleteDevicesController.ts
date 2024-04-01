import {Request, Response} from "express";
import {DeviceViewModelType} from "../../../input-output-types/common/common-types";
import {securityQueryRepository} from "../repository/securityQueryRepository";
import {ObjectId} from "mongodb";
import {postsService} from "../../posts/domain/posts-service";
import {securityService} from "../domain/security-service";

export const deleteDevicesController = async (req: Request<any, any, any, any>, res: Response) => {

    await securityService.deleteNonCurrentSessions(req.userId!, req.deviceId!);

    res.sendStatus(204);
}