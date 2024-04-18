import {BcryptService} from "../../../common/adapters/bcrypt-service";
import {UserAccountDBType} from "../../../input-output-types/inputOutputTypesMongo";
import {ObjectId, WithId} from "mongodb";
import {v4 as uuidv4} from 'uuid';
import {add} from "date-fns"
import {UsersQueryRepository} from "../../users/repositories/userQueryRepository";
import {ResultObject} from "../../../common/types/result.types";
import {ResultStatus} from "../../../common/types/resultCode";
import {BusinessService} from "../../../common/domain/business-service";
import {JWTService} from "../../../common/adapters/jwt-service";
import {SETTING} from "../../../main/setting";
import { PayloadTokenType} from "../../../input-output-types/common/common-types";
import {NewPasswordRecoveryInputModel} from "../../../input-output-types/auth/inputTypes";
import {UsersRepository} from "../../users/repositories/usersRepository";
import {DeviceAuthSessionsModel} from "../../../db/mongo/devicesAuthSessions/deviceAuthSession.model";
import {injectable} from "inversify";

@injectable()
export class AuthService{

    constructor(
        protected bcryptService: BcryptService,
        protected businessService: BusinessService,
        protected jwtService: JWTService,
        protected usersRepository: UsersRepository,
        protected usersQueryRepository: UsersQueryRepository
    ) {}
    async registerUser(login: string, email: string, password: string): Promise<ResultObject> {

        const passwordHash = await this.bcryptService.generationHash(password);

        const newUser: WithId<UserAccountDBType> = {
            _id: new ObjectId(),
            accountData: {
                userName: login,
                email,
                passwordHash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate:
                    add(new Date(), {
                        hours: 1,
                        minutes: 3
                    })
                ,
                isConfirmed: false
            }

        }
        const createdUser = await this.usersRepository.save(newUser);

        if (!createdUser) return {
            status: ResultStatus.BadRequest,
            errorField: 'code',
            errorMessage: 'Not found user',
            data: null
        }
        try {
            this.businessService.sendRegisrtationEmail(email, newUser.emailConfirmation.confirmationCode);
        } catch (e: unknown) {
            console.error('Send email error', e);
        }

        return {
            status: ResultStatus.Success,
            data: null
        }

    }
    async confirmEmail(codeConfirmation: string): Promise<ResultObject> {

        const foundedUser = await this.usersQueryRepository.findByCodeConfirmation(codeConfirmation);
        if (!foundedUser) return {
            status: ResultStatus.BadRequest,
            errorField: 'code',
            errorMessage: 'Not found user',
            data: null
        }
        if (foundedUser.emailConfirmation.isConfirmed) return {
            status: ResultStatus.BadRequest,
            errorField: 'code',
            errorMessage: 'Code confirmation already been applied',
            data: null
        }
        if (foundedUser.emailConfirmation.expirationDate < new Date()) {
            return {
                status: ResultStatus.BadRequest,
                errorField: 'code',
                errorMessage: 'Code confirmation is expired',
                data: null
            }
        }

        await this.usersRepository.updateConfirmation(foundedUser._id);

        return {
            status: ResultStatus.Success,
            errorMessage: 'Code confirmation is expired',
            data: null
        }
    }
    async confirmEmailAndUpdatePassword(input: NewPasswordRecoveryInputModel): Promise<ResultObject> {

        const foundedUser = await this.usersQueryRepository.findByCodeConfirmation(input.recoveryCode);

        if (!foundedUser) return {
            status: ResultStatus.BadRequest,
            errorField: 'recoveryCode',
            errorMessage: 'Not found user',
            data: null
        }
        if (foundedUser.emailConfirmation.isConfirmed) return {
            status: ResultStatus.BadRequest,
            errorField: 'recoveryCode',
            errorMessage: 'Code confirmation already been applied',
            data: null
        }
        if (foundedUser.emailConfirmation.expirationDate < new Date()) {
            return {
                status: ResultStatus.BadRequest,
                errorField: 'recoveryCode',
                errorMessage: 'Code confirmation is expired',
                data: null
            }
        }

        await this.usersRepository.updateConfirmation(foundedUser._id);

        const passwordHash = await this.bcryptService.generationHash(input.newPassword);

        await this.usersRepository.updatePasswordHash(foundedUser._id,passwordHash);

        return {
            status: ResultStatus.Success,
            errorMessage: 'Code confirmation is expired',
            data: null
        }
    }
    async resendingEmail(email: string): Promise<ResultObject> {

        const user = await this.usersQueryRepository.findByLoginOrEmail(email);

        if (!user) return {
            status: ResultStatus.BadRequest,
            errorField: 'email',
            errorMessage: 'User not founded by email',
            data: null
        }
        if (user.emailConfirmation.isConfirmed) return {
            status: ResultStatus.BadRequest,
            errorField: 'email',
            errorMessage: 'Code confirmation already been applied',
            data: null
        }

        const newConfirmationCode = uuidv4();
        await this.usersRepository.updateConfirmationCode(user._id, newConfirmationCode, add(new Date(), {
            hours: 1,
            minutes: 3
        }))

        try {
            this.businessService.sendRegisrtationEmail(email, newConfirmationCode);
        } catch (e: unknown) {
            console.error('Send email error', e);
        }

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    async recoveryPasswordSendCode(email: string): Promise<ResultObject> {

        const user = await this.usersQueryRepository.findByLoginOrEmail(email);

        if (!user) return {
            status: ResultStatus.Success,
            data: null
        }

        console.log("Hi test this user!", user)
        const newConfirmationCode = uuidv4();

        await this.usersRepository.updateConfirmationCode(user._id, newConfirmationCode, add(new Date(), {
            hours: 1,
            minutes: 3
        }))

        try {
            await this.businessService.sendRecoveryPassword(email, newConfirmationCode);
        } catch (e: unknown) {
            console.error('Send email error', e);
        }

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    async checkAccessToken(authHeader: string): Promise<ResultObject<ObjectId | null>> {

        const auth = authHeader.split(" ");
        if (auth[0] !== 'Bearer') return {

            status: ResultStatus.Unauthorized,
            errorField: 'access token',
            errorMessage: 'Wrong authorization',
            data: null

        }
        const payloadAccessToken = await this.jwtService.verifyAndGetPayloadToken(auth[1], SETTING.JWT_SECRET);

        if (!payloadAccessToken) return {

            status: ResultStatus.Unauthorized,
            errorField: 'access token',
            errorMessage: 'Wrong access token',
            data: null

        }

        const user = await this.usersQueryRepository.findForOutput(new ObjectId(payloadAccessToken.userId));

        if (!user) return {

            status: ResultStatus.Unauthorized,
            errorField: 'user id',
            errorMessage: 'User not found',
            data: null

        }

        return {

            status: ResultStatus.Success,
            data: payloadAccessToken.userId

        }

    }
    async checkRefreshToken(refreshToken: string): Promise<ResultObject<PayloadTokenType | null>> {

        const payloadRefreshToken = await this.jwtService.verifyAndGetPayloadToken(refreshToken, SETTING.JWT_REFRESH_SECRET);

        const fullPayload = await this.jwtService.decodeToken(refreshToken);

        console.log("payloadRefreshToken", fullPayload)

        if (!payloadRefreshToken) return {

            status: ResultStatus.Unauthorized,
            errorField: 'Refresh token',
            errorMessage: 'Wrong refresh token',
            data: null

        }

        const user = await this.usersQueryRepository.findForOutput(new ObjectId(payloadRefreshToken.userId))

        if (!user) {

            return {

                status: ResultStatus.Unauthorized,
                errorField: 'user',
                errorMessage: 'Not found user',
                data: null

            }
        }

        const session = await this.getSession(payloadRefreshToken.userId.toString(), payloadRefreshToken.deviceId!, new Date(fullPayload.iat*1000));

        console.log("session", session);

        if (!session) {

            return {

                status: ResultStatus.Unauthorized,
                errorField: 'session',
                errorMessage: 'Not found session',
                data: null

            }
        }

        return {

            status: ResultStatus.Success,
            data: payloadRefreshToken

        }

    }

    async updateToken(refreshToken: string){

        const payloadOldRefreshToken = await this.jwtService.decodeToken(refreshToken);
        const session = await this.getSession(payloadOldRefreshToken.userId, payloadOldRefreshToken.deviceId!, new Date(payloadOldRefreshToken.iat*1000));

        const newDeviceId = uuidv4();

        const payLoadRefreshToken: PayloadTokenType = {userId: payloadOldRefreshToken.userId, deviceId: payloadOldRefreshToken.deviceId!};
        const newRefreshToken = await this.jwtService.createToken(payLoadRefreshToken, SETTING.AC_REFRESH_TIME, SETTING.JWT_REFRESH_SECRET);
        const newPayloadRefreshToken = await this.jwtService.decodeToken(newRefreshToken);

        try {
            await this.updateSession(session!._id, new Date(newPayloadRefreshToken.iat*1000), new Date(newPayloadRefreshToken.exp*1000));
        } catch (e) {
             console.log("this error", e)
        }


        return newRefreshToken;

    }
    async getSession(userId: string, deviceId: string, iat: Date){

        return DeviceAuthSessionsModel.findOne({userId: userId, deviceId: deviceId, iat: iat});

    }
    async updateSession(_id: ObjectId, iat: Date, exp: Date){

        await DeviceAuthSessionsModel.findByIdAndUpdate(_id,
            {$set: {
                      iat: iat,
                      exp: exp
                  }})
    }
}

