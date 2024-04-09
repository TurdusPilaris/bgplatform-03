import {
     UserAccountDBType,

} from "../../../input-output-types/inputOutputTypesMongo";
import {userCollection} from "../../../db/mongo/mongo-db";
import {ObjectId, WithId} from "mongodb";
import {UserInputModelType} from "../../../input-output-types/users/inputTypes";
import {userMongoRepository} from "../repositories/usersMongoRepositories";
import {bcryptService} from "../../../common/adapters/bcrypt-service";
import {userQueryRepository} from "../repositories/userQueryRepository";

export const usersService = {
    async create(input: UserInputModelType) {

        const passwordHash = await bcryptService.generationHash(input.password);

        const newUser: WithId<UserAccountDBType> = {
            _id: new ObjectId(),
            accountData:{
                userName: input.login,
                email: input.email,
                passwordHash: passwordHash,
                createdAt: new Date().toISOString(),
            },
            emailConfirmation:{
                confirmationCode: '',
                expirationDate: new Date(),
                isConfirmed: true
            }
        }
        return userMongoRepository.create(newUser);

    },

    async checkCredentials(loginOrEmail: string, password: string) {

        const user = await userQueryRepository.findByLoginOrEmail(loginOrEmail)

        if (!user) return false;
        if(!user.emailConfirmation.isConfirmed) return false;

        return await bcryptService.checkPassword(password, user.accountData.passwordHash);
    },

    async find(id: ObjectId) {

        return await userCollection.findOne({_id: id});

    },

    async findForOutput(id: ObjectId) {
        const foundUser = await this.find(id);
        if (!foundUser) {
            return undefined
        }
        return userQueryRepository.mapToOutput(foundUser);
    },

    async deleteUser(id: ObjectId) {

        await userMongoRepository.delete(id);

    },
}