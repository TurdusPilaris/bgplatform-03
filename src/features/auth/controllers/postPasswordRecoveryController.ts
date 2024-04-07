import {Request, Response} from "express";
import {authService} from "../domain/auth-service";
import {ResultStatus} from "../../../common/types/resultCode";
export const postPasswordRecoveryController = async (req: Request, res: Response) => {

    const result = await authService.recoveryPasswordSendCode(req.body.email);

    if (result.status === ResultStatus.BadRequest) {
        res.status(400).send({errorsMessages: [{message: result.errorMessage, field: result.errorField}]})
        return;
    }
    if (result.status === ResultStatus.Success) {
        res.sendStatus(204)
        return
    }
}