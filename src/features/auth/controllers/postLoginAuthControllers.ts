import {Request, Response} from "express";
import {LoginInputType} from "../../../input-output-types/auth/inputTypes";
import {usersService} from "../../users/domain/users-service";
import {userQueryRepository} from "../../users/repositories/userQueryRepository";
import {jwtService} from "../../../common/adapters/jwt-service";
import {SETTING} from "../../../main/setting";
import {PayloadTokenType} from "../../../input-output-types/common/common-types";
import {v4 as uuidv4} from 'uuid';
import {securityService} from "../../security/domain/security-service";
import {ResultStatus} from "../../../common/types/resultCode";

export const postLoginAuthControllers = async (req: Request<LoginInputType>, res: Response) => {

    const result = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);

    if (result) {

        const user = await userQueryRepository.findByLoginOrEmail(req.body.loginOrEmail);

        const payLoadAccessToken: PayloadTokenType = {userId: user!._id};
        const token = await jwtService.createToken(payLoadAccessToken, SETTING.AC_TIME, SETTING.JWT_SECRET);

        const newDeviceId = uuidv4();

        const payLoadRefreshToken: PayloadTokenType = {userId: user!._id, deviceId: newDeviceId};
        const refreshToken = await jwtService.createToken(payLoadRefreshToken, SETTING.AC_REFRESH_TIME, SETTING.JWT_REFRESH_SECRET);

        const fullPayLoadRefreshToken = await jwtService.decodeToken(refreshToken);
        const resultCreated = await securityService.createSession(fullPayLoadRefreshToken, req.headers['user-agent']??'string', req.ip);

        if (resultCreated.status === ResultStatus.BadRequest) {
            res.status(400).send({errorsMessages: [{message: resultCreated.errorMessage, field: resultCreated.errorField}]});
            return;
        } else if(resultCreated.status === ResultStatus.InternalServerError) {
            res.status(500).send({errorsMessages: [{message: resultCreated.errorMessage, field: resultCreated.errorField}]});
            return;
        }
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,});
        res.status(200).send({"accessToken":token});

    } else {
        res.sendStatus(401);
    }


}