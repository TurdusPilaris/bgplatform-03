import {UserDB} from "../../../input-output-types/inputOutputTypesMongo";
import {userCollection} from "../../../db/mongo/mongo-db";
import {ObjectId} from "mongodb";
import {UserInputModelType} from "../../../input-output-types/users/inputTypes";
import {userMongoRepository} from "../repositories/usersMongoRepositories";
import {bcryptService} from "../../../common/adapters/bcrypt-service";
import {UsersQueryRepository} from "../repositories/userQueryRepository";
import {UsersRepository} from "../repositories/usersRepository";
import {ResultStatus} from "../../../common/types/resultCode";
import {ResultObject} from "../../../common/types/result.types";
import {UserViewModelType} from "../../../input-output-types/users/outputTypes";

export class UsersService {
    constructor(
        protected usersRepository: UsersRepository,
        protected usersQueryRepository: UsersQueryRepository
    ) {}

    async create(input: UserInputModelType) :Promise<ResultObject<UserViewModelType|null>> {

        const passwordHash = await bcryptService.generationHash(input.password);

        if (!passwordHash) {
            return {
                status: ResultStatus.InternalServerError,
                data: null
            }
        }
        const newUserClass = new UserDB(
            {
                userName: input.login,
                email: input.email,
                passwordHash: passwordHash,
                createdAt: new Date().toISOString(),
            },
            {
                confirmationCode: '',
                expirationDate: new Date(),
                isConfirmed: true
            }
        )

        const userId = await this.usersRepository.save(newUserClass);

        if (!userId) {
            return {
                status: ResultStatus.InternalServerError,
                data: null
            }
        }

        const newUser = await this.findForOutput(userId);

        return {
            status: ResultStatus.Success,
            data: newUser
        }
    }

    async checkCredentials(loginOrEmail: string, password: string) {

        const user = await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail)

        if (!user) return false;
        if(!user.emailConfirmation.isConfirmed) return false;

        return await bcryptService.checkPassword(password, user.accountData.passwordHash);
    }

    async find(id: ObjectId) {

        return await userCollection.findOne({_id: id});

    }

    async findForOutput(id: ObjectId) {
        const foundUser = await this.find(id);
        if (!foundUser) {
            return null
        }
        return this.usersQueryRepository.mapToOutput(foundUser);
    }

    async deleteUser(id: ObjectId) {

        await userMongoRepository.delete(id);

    }
}