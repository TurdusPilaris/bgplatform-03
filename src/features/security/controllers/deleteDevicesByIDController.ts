import {Request, Response} from "express";
import {securityService} from "../domain/security-service";
import {ResultStatus} from "../../../common/types/resultCode";

export const deleteDevicesByIDController = async (req: Request<any, any, any, any>, res: Response) => {

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