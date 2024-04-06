import {bcryptService} from "../../../common/adapters/bcrypt-service";
import {BlackListDBMongoType, UserAccountDBMongoType} from "../../../input-output-types/inputOutputTypesMongo";
import {userMongoRepository} from "../../users/repositories/usersMongoRepositories";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from 'uuid';
import {add} from "date-fns"
import {userQueryRepository} from "../../users/repositories/userQueryRepository";
import {ResultObject} from "../../../common/types/result.types";
import {ResultStatus} from "../../../common/types/resultCode";
import {businessService} from "../../../common/domain/business-service";
import {jwtService} from "../../../common/adapters/jwt-service";
import {SETTING} from "../../../main/setting";
import {blackListCollection, deviceAuthSessions, userCollection} from "../../../db/mongo/mongo-db";
import {DeviceAuthSessionsType, PayloadTokenType} from "../../../input-output-types/common/common-types";

export const authService = {

    async registerUser(login: string, email: string, password: string): Promise<ResultObject> {

        const passwordHash = await bcryptService.generationHash(password);

        const newUser: UserAccountDBMongoType = {
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
        const createdUser = await userMongoRepository.create(newUser);

        if (!createdUser) return {
            status: ResultStatus.BadRequest,
            errorField: 'code',
            errorMessage: 'Not found user',
            data: null
        }
        try {
            businessService.sendRegisrtationEmail(email, newUser.emailConfirmation.confirmationCode);
        } catch (e: unknown) {
            console.error('Send email error', e);
        }

        return {
            status: ResultStatus.Success,
            data: null
        }

    },
    async confirmEmail(codeConfirmation: string): Promise<ResultObject> {

        const foundedUser = await userQueryRepository.findByCodeConfirmation(codeConfirmation);
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

        await userMongoRepository.updateConfirmation(foundedUser._id);

        return {
            status: ResultStatus.Success,
            errorMessage: 'Code confirmation is expired',
            data: null
        }
    },
    async resendingEmail(email: string): Promise<ResultObject> {

        const user = await userQueryRepository.findByLoginOrEmail(email);

        if (user.emailConfirmation.isConfirmed) return {
            status: ResultStatus.BadRequest,
            errorField: 'email',
            errorMessage: 'Code confirmation already been applied',
            data: null
        }

        const newConfirmationCode = uuidv4();
        await userMongoRepository.updateConfirmationCode(user._id, newConfirmationCode, add(new Date(), {
            hours: 1,
            minutes: 3
        }))

        try {
            businessService.sendRegisrtationEmail(email, newConfirmationCode);
        } catch (e: unknown) {
            console.error('Send email error', e);
        }

        return {
            status: ResultStatus.Success,
            data: null
        }
    },
    async checkAccessToken(authHeader: string): Promise<ResultObject<ObjectId | null>> {

        const auth = authHeader.split(" ");
        if (auth[0] !== 'Bearer') return {

            status: ResultStatus.Unauthorized,
            errorField: 'access token',
            errorMessage: 'Wrong authorization',
            data: null

        }
        const payloadAccessToken = await jwtService.verifyAndGetPayloadToken(auth[1], SETTING.JWT_SECRET);

        if (!payloadAccessToken) return {

            status: ResultStatus.Unauthorized,
            errorField: 'access token',
            errorMessage: 'Wrong access token',
            data: null

        }

        const user = await userQueryRepository.findForOutput(new ObjectId(payloadAccessToken.userId));

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

    },
    async checkRefreshToken(refreshToken: string): Promise<ResultObject<PayloadTokenType | null>> {

        const payloadRefreshToken = await jwtService.verifyAndGetPayloadToken(refreshToken, SETTING.JWT_REFRESH_SECRET);

        const fullPayload = await jwtService.decodeToken(refreshToken);

        console.log("payloadRefreshToken", fullPayload)

        if (!payloadRefreshToken) return {

            status: ResultStatus.Unauthorized,
            errorField: 'Refresh token',
            errorMessage: 'Wrong refresh token',
            data: null

        }

        const user = await userQueryRepository.findForOutput(new ObjectId(payloadRefreshToken.userId))

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

    },
    async getRefreshTokenBlackList(refreshToken: string, userId: ObjectId): Promise<BlackListDBMongoType | null> {

        return await blackListCollection.findOne({userId: userId.toString(), refreshToken: refreshToken});

    },
    async updateBlackList(refreshToken: string, userId: ObjectId) {

        try {
            await blackListCollection.insertOne({
                _id: new ObjectId(),
                refreshToken: refreshToken,
                userId: userId.toString()
            });
        } catch (e) {

        }

    },

    async updateToken(refreshToken: string){

        const payloadOldRefreshToken = await jwtService.decodeToken(refreshToken);
        const session = await this.getSession(payloadOldRefreshToken.userId, payloadOldRefreshToken.deviceId!, new Date(payloadOldRefreshToken.iat*1000));

        const newDeviceId = uuidv4();

        const payLoadRefreshToken: PayloadTokenType = {userId: payloadOldRefreshToken.userId, deviceId: payloadOldRefreshToken.deviceId!};
        const newRefreshToken = await jwtService.createToken(payLoadRefreshToken, SETTING.AC_REFRESH_TIME, SETTING.JWT_REFRESH_SECRET);
        const newPayloadRefreshToken = await jwtService.decodeToken(newRefreshToken);

        try {
            console.log("session!._id", session!._id)
            console.log("дата iat", new Date(newPayloadRefreshToken.iat*1000))
            console.log("дата exp", new Date(newPayloadRefreshToken.exp*1000))
            await this.updateSession(session!._id, new Date(newPayloadRefreshToken.iat*1000), new Date(newPayloadRefreshToken.exp*1000));
        } catch (e) {
            console.log("session!._id", session!._id)
            console.log("дата iat", new Date(newPayloadRefreshToken.iat*1000))
            console.log("дата exp", new Date(newPayloadRefreshToken.exp*1000))
            console.log("this error", e)
        }


        return newRefreshToken;

    },
    async getSession(userId: string, deviceId: string, iat: Date){

        return deviceAuthSessions.findOne({userId: userId, deviceId: deviceId, iat: iat});

    },
    async updateSession(_id: ObjectId, iat: Date, exp: Date){

       await deviceAuthSessions.updateOne({_id: _id}, {
            $set: {
                iat: iat,
                exp: exp
            }
        })
    }
}

