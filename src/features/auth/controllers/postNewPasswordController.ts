import {Request, Response} from "express";
import {authService} from "../domain/auth-service";
import {NewPasswordRecoveryInputModel} from "../../../input-output-types/auth/inputTypes";
import {ResultStatus} from "../../../common/types/resultCode";

export const postNewPasswordController = async (req: Request<any,NewPasswordRecoveryInputModel>, res:Response) =>{

    const resultObject =  await authService.confirmEmailAndUpdatePassword(req.body);

    if (resultObject.status === ResultStatus.BadRequest) {
        res.status(400).send({errorsMessages: [{message: resultObject.errorMessage, field: resultObject.errorField}]});
        return;
    } else if (resultObject.status === ResultStatus.Success) {
        res.sendStatus(204);
        return;
    }
}