import {Request, Response} from "express";
import {LoginInputType} from "../../../input-output-types/auth/inputTypes";
import {jwtService} from "../../../common/adapters/jwt-service";
import {SETTING} from "../../../main/setting";
import {ObjectId} from "mongodb";
import {PayloadTokenType} from "../../../input-output-types/common/common-types";
import {authService} from "../domain/auth-service";

export const postRefreshTokenController = async (req: Request<LoginInputType>, res: Response) => {

    const oldRefreshToken = req.cookies.refreshToken;

    //create new access token
    const payLoadAccessToken: PayloadTokenType = {userId: new ObjectId(req.userId!)};
    const token = await jwtService.createToken(payLoadAccessToken, SETTING.AC_TIME, SETTING.JWT_SECRET);

    //create new refresh token
    const refreshToken = await authService.updateToken(oldRefreshToken);

    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,});
    res.status(200).send({"accessToken": token});

}