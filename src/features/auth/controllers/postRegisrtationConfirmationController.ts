import { Request, Response} from "express";
import {authService} from "../domain/auth-service";
import {ResultStatus} from "../../../common/types/resultCode";
import {RegisrtationConfirmationCodeModelType} from "../../../input-output-types/auth/inputTypes";
export const postRegisrtationConfirmationController = async (req: Request<RegisrtationConfirmationCodeModelType>, res: Response) => {

      const resultObject = await authService.confirmEmail(req.body.code);

    if(resultObject.status === ResultStatus.BadRequest) {
        res.status(400).send({errorsMessages:[ {message: resultObject.errorMessage, field: resultObject.errorField}]});
        return;
    } else if(resultObject.status === ResultStatus.Success) {
        res.sendStatus(204);
        return;
    }

}