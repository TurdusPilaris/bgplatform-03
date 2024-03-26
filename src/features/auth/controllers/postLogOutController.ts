import { Request, Response} from "express";
import {LoginInputType} from "../../../input-output-types/auth/inputTypes";
import {jwtService} from "../../../common/adapters/jwt-service";
import {LoginSuccessViewModelType} from "../../../input-output-types/auth/outoutTypes";
import {SETTING} from "../../../main/setting";
import {authService} from "../domain/auth-service";
export const postLogOutControllers = async (req: Request<LoginInputType>, res: Response<LoginSuccessViewModelType>) => {

    const userId = await jwtService.getUserIdByToken(req.cookies.refreshToken, SETTING.JWT_REFRESH_SECRET);
    await authService.updateBlackList(req.cookies.refreshToken, userId!);

    res.sendStatus(204);
}