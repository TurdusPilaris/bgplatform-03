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
import {blackListCollection} from "../../../db/mongo-db";

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

        if(!createdUser) return {
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
    async resendingEmail(email:string):Promise<ResultObject> {

        const user = await userQueryRepository.findByLoginOrEmail(email);

        if (user.emailConfirmation.isConfirmed) return {
            status: ResultStatus.BadRequest,
            errorField: 'email',
            errorMessage: 'Code confirmation already been applied',
            data: null
        }

        const newConfirmationCode =  uuidv4();
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
    async checkAccessToken(authHeader:string):Promise<ResultObject<ObjectId|null>> {

        const auth = authHeader.split(" ");
        if(auth[0]!=='Bearer') return {

                 status: ResultStatus.Unauthorized,
                 errorField: 'access token',
                 errorMessage: 'Wrong authorization',
                 data: null

        }
        const userId = await jwtService.getUserIdByToken(auth[1], SETTING.JWT_SECRET);

        if(!userId) return {

            status: ResultStatus.Unauthorized,
            errorField: 'access token',
            errorMessage: 'Wrong access token',
            data: null

        }

         const user = await userQueryRepository.findForOutput(new ObjectId(userId));

        if(!user) return {

            status: ResultStatus.Unauthorized,
            errorField: 'user id',
            errorMessage: 'User not found',
            data: null

        }

        return {

            status: ResultStatus.Success,
            data: userId

        }

    },
    async checkRefreshToken(refreshToken:string):Promise<ResultObject<ObjectId|null>> {

        const userId = await jwtService.getUserIdByToken(refreshToken, SETTING.JWT_REFRESH_SECRET);


        if(!userId) return {

            status: ResultStatus.Unauthorized,
            errorField: 'Refresh token',
            errorMessage: 'Wrong refresh token',
            data: null

        }

        const blackList = await this.getRefreshTokenBlackList(refreshToken, userId);

        if(blackList) {
            return {
            status: ResultStatus.Unauthorized,
                errorField: 'Refresh token',
                errorMessage: 'Refresh token in black list',
                data: null

            }
        }

        const user = await userQueryRepository.findForOutput(userId)

        if (user) {

            return {

                status: ResultStatus.Unauthorized,
                errorField: 'user',
                errorMessage: 'Not found user',
                data: null

            }
        }
        if (!userId) {

            return {

                status: ResultStatus.Unauthorized,
                errorField: 'access token',
                errorMessage: 'Wrong access token',
                data: null

            }
        }

        await this.updateBlackList(refreshToken, userId);

        return {

            status: ResultStatus.Success,
            data: userId

        }

    },
    async getRefreshTokenBlackList(refreshToken:string, userId:ObjectId):Promise<BlackListDBMongoType|null> {

        return await blackListCollection.findOne({userId: userId.toString(),refreshToken: refreshToken });

    }
    ,
    async updateBlackList(refreshToken:string, userId:ObjectId) {

        try {
            await blackListCollection.insertOne({_id: new ObjectId(), refreshToken: refreshToken, userId: userId.toString()});
        } catch (e) {

        }

    }
}

