import {Request, Response} from "express";
import {LoginInputType} from "../../../input-output-types/auth/inputTypes";
import {jwtService} from "../../../common/adapters/jwt-service";
import {SETTING} from "../../../main/setting";
import {ObjectId} from "mongodb";

export const postRefreshTokenController = async (req: Request<LoginInputType>, res: Response) => {

    const token = await jwtService.createToken(new ObjectId(req.userId!), SETTING.AC_TIME, SETTING.JWT_SECRET);
    const refreshToken = await jwtService.createToken(new ObjectId(req.userId!), SETTING.AC_REFRESH_TIME, SETTING.JWT_REFRESH_SECRET);
    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,});
    res.status(200).send({"accessToken": token});

}