import {Request, Response} from "express";
import {UserInputModelType} from "../../../input-output-types/users/inputTypes";
import {authService} from "../domain/auth-service";
import {ResultStatus} from "../../../common/types/resultCode";

export const postRegistrationControllers = async (req: Request<UserInputModelType>, res: Response) => {

    const resultObject = await authService.registerUser(req.body.login,
        req.body.email, req.body.password)

    if(resultObject.status === ResultStatus.BadRequest) {
        res.sendStatus(400);
        return;
    } else if(resultObject.status === ResultStatus.Success) {
        res.sendStatus(204);
        return;
    }

}

