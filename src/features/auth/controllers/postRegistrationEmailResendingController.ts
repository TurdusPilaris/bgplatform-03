import {Request, Response} from "express";
import {ResultStatus} from "../../../common/types/resultCode";
import {authService} from "../domain/auth-service";

export const postRegistrationEmailResendingController = async (req: Request<{email:string}>, res: Response) => {


    const result = await authService.resendingEmail(req.body.email);

    if (result.status === ResultStatus.BadRequest) {
        res.status(400).send({errorsMessages: [{message: result.errorMessage, field: result.errorField}]})
        return;
    }
    if (result.status === ResultStatus.Success) {
        res.sendStatus(204)
            // .send(result.data!)
        return
    }

}