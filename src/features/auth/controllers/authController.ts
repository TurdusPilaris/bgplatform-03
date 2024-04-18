import {Request, Response} from "express";
import {UserInputModelType} from "../../../input-output-types/users/inputTypes";
import {AuthService} from "../domain/auth-service";
import {ResultStatus} from "../../../common/types/resultCode";
import {
    LoginInputType,
    NewPasswordRecoveryInputModel,
    RegisrtationConfirmationCodeModelType
} from "../../../input-output-types/auth/inputTypes";
import {PayloadTokenType} from "../../../input-output-types/common/common-types";
import {ObjectId} from "mongodb";
import {JWTService} from "../../../common/adapters/jwt-service";
import {SETTING} from "../../../main/setting";
import {LoginSuccessViewModelType} from "../../../input-output-types/auth/outoutTypes";
import {SecurityService} from "../../security/domain/security-service";
import {UsersService} from "../../users/domain/users-service";
import {UsersQueryRepository} from "../../users/repositories/userQueryRepository";
import {v4 as uuidv4} from "uuid";
import {MeViewModelType} from "../../../input-output-types/users/outputTypes";
import {injectable} from "inversify";
@injectable()
export class AuthController{

    constructor(
        protected authService: AuthService,
        protected usersService: UsersService,
        protected jwtService: JWTService,
        protected usersQueryRepository: UsersQueryRepository,
        protected securityService: SecurityService

    ) {
    }
    async postRegistrationControllers(req: Request<UserInputModelType>, res: Response) {

        const resultObject = await this.authService.registerUser(req.body.login,
            req.body.email, req.body.password)

        if(resultObject.status === ResultStatus.BadRequest) {
            res.sendStatus(400);
            return;
        } else if(resultObject.status === ResultStatus.Success) {
            res.sendStatus(204);
            return;
        }

    }
    async postRegistrationEmailResendingController(req: Request<{email:string}>, res: Response) {

        const result = await this.authService.resendingEmail(req.body.email);

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
    async postRegisrtationConfirmationController(req: Request<RegisrtationConfirmationCodeModelType>, res: Response) {

        const resultObject = await this.authService.confirmEmail(req.body.code);

        if (resultObject.status === ResultStatus.BadRequest) {
            res.status(400).send({errorsMessages: [{message: resultObject.errorMessage, field: resultObject.errorField}]});
            return;
        } else if (resultObject.status === ResultStatus.Success) {
            res.sendStatus(204);
            return;
        }

    }
    async postRefreshTokenController(req: Request<LoginInputType>, res: Response){

        const oldRefreshToken = req.cookies.refreshToken;

        //create new access token
        const payLoadAccessToken: PayloadTokenType = {userId: new ObjectId(req.userId!)};
        const token = await this.jwtService.createToken(payLoadAccessToken, SETTING.AC_TIME, SETTING.JWT_SECRET);

        //create new refresh token
        const refreshToken = await this.authService.updateToken(oldRefreshToken);

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,});
        res.status(200).send({"accessToken": token});

    }
    async postPasswordRecoveryController(req: Request, res: Response) {

        const result = await this.authService.recoveryPasswordSendCode(req.body.email);

        if (result.status === ResultStatus.BadRequest) {
            res.status(400).send({errorsMessages: [{message: result.errorMessage, field: result.errorField}]})
            return;
        }
        if (result.status === ResultStatus.Success) {
            res.sendStatus(204)
            return
        }
    }
    async postNewPasswordController(req: Request<any,NewPasswordRecoveryInputModel>, res:Response) {

        const resultObject =  await this.authService.confirmEmailAndUpdatePassword(req.body);

        if (resultObject.status === ResultStatus.BadRequest) {
            res.status(400).send({errorsMessages: [{message: resultObject.errorMessage, field: resultObject.errorField}]});
            return;
        } else if (resultObject.status === ResultStatus.Success) {
            res.sendStatus(204);
            return;
        }
    }
    async postLogOutControllers(req: Request<LoginInputType>, res: Response<LoginSuccessViewModelType>) {

        const payload = await this.jwtService.decodeToken(req.cookies.refreshToken);

        await this.securityService.dropCurrentSession(payload.userId!, payload.deviceId!)

        res.sendStatus(204);
    }
    async postLoginAuthControllers(req: Request<LoginInputType>, res: Response) {

        const result = await this.usersService.checkCredentials(req.body.loginOrEmail, req.body.password);

        if (result) {

            const user = await this.usersQueryRepository.findByLoginOrEmail(req.body.loginOrEmail);

            const payLoadAccessToken: PayloadTokenType = {userId: user!._id};
            const token = await this.jwtService.createToken(payLoadAccessToken, SETTING.AC_TIME, SETTING.JWT_SECRET);

            const newDeviceId = uuidv4();

            const payLoadRefreshToken: PayloadTokenType = {userId: user!._id, deviceId: newDeviceId};
            const refreshToken = await this.jwtService.createToken(payLoadRefreshToken, SETTING.AC_REFRESH_TIME, SETTING.JWT_REFRESH_SECRET);

            const fullPayLoadRefreshToken = await this.jwtService.decodeToken(refreshToken);
            const resultCreated = await this.securityService.createSession(fullPayLoadRefreshToken, req.headers['user-agent']??'string', req.ip);

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

    async getInformationMe(req: Request, res: Response<MeViewModelType>) {

        const result = await this.usersQueryRepository.getAboutMe(req.userId);

        if (result.status === ResultStatus.BadRequest) { res.sendStatus(400)}

        if(result.status === ResultStatus.Success) { res.status(200).send(result.data!)}

    }
}