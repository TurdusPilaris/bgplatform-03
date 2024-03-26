import { Request, Response} from "express";
import {LoginInputType} from "../../../input-output-types/auth/inputTypes";
import {usersService} from "../../users/domain/users-service";
import {userQueryRepository} from "../../users/repositories/userQueryRepository";
import {jwtService} from "../../../common/adapters/jwt-service";
import {LoginSuccessViewModelType} from "../../../input-output-types/auth/outoutTypes";
import {SETTING} from "../../../main/setting";
export const postLoginAuthControllers = async (req: Request<LoginInputType>, res: Response<LoginSuccessViewModelType>) => {

    const result = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);

    if (result) {

        const user = await userQueryRepository.findByLoginOrEmail(req.body.loginOrEmail);

        const token = await jwtService.createToken(user!._id, SETTING.AC_TIME, SETTING.JWT_SECRET);
        const refreshToken = await jwtService.createToken(user!._id, SETTING.AC_REFRESH_TIME, SETTING.JWT_REFRESH_SECRET);
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,});
        res.status(200).send({"accessToken":token});
    } else {
        res.sendStatus(401);
    }


}