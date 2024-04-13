import {UserDB} from "../../../input-output-types/inputOutputTypesMongo";
import {ObjectId} from "mongodb";
import {UserInputModelType} from "../../../input-output-types/users/inputTypes";
import {UsersQueryRepository} from "../repositories/userQueryRepository";
import {UsersRepository} from "../repositories/usersRepository";
import {ResultStatus} from "../../../common/types/resultCode";
import {ResultObject} from "../../../common/types/result.types";
import {UserViewModelType} from "../../../input-output-types/users/outputTypes";
import {BcryptService} from "../../../common/adapters/bcrypt-service";

export class UsersService {
    constructor(
        protected usersRepository: UsersRepository,
        protected usersQueryRepository: UsersQueryRepository,
        protected bcryptService: BcryptService
    ) {}

    async create(input: UserInputModelType) :Promise<ResultObject<UserViewModelType|null>> {

        const passwordHash = await this.bcryptService.generationHash(input.password);

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

        const newUser = await this.usersQueryRepository.findForOutput(userId);

        return {
            status: ResultStatus.Success,
            data: newUser
        }
    }

    async checkCredentials(loginOrEmail: string, password: string) {

        const user = await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail)

        if (!user) return false;
        if(!user.emailConfirmation.isConfirmed) return false;

        return await this.bcryptService.checkPassword(password, user.accountData.passwordHash);
    }

    async deleteUser(id: ObjectId) {

        await this.usersRepository.delete(id);

    }
}