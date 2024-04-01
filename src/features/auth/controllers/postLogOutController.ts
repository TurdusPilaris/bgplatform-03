import { Request, Response} from "express";
import {LoginInputType} from "../../../input-output-types/auth/inputTypes";
import {jwtService} from "../../../common/adapters/jwt-service";
import {LoginSuccessViewModelType} from "../../../input-output-types/auth/outoutTypes";
import {SETTING} from "../../../main/setting";
import {authService} from "../domain/auth-service";
import {securityService} from "../../security/domain/security-service";

export const postLogOutControllers = async (req: Request<LoginInputType>, res: Response<LoginSuccessViewModelType>) => {

    const payload = await jwtService.decodeToken(req.cookies.refreshToken);

    await securityService.dropCurrentSession(payload.userId!, payload.deviceId!)

    res.sendStatus(204);
}