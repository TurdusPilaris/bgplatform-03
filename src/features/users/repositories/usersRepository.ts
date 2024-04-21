import {UserDB} from "../../../input-output-types/inputOutputTypesMongo";
import {UserDocument, UserModel} from "../../../db/mongo/user/user.model";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
@injectable()
export class UsersRepository{
    async save(user: UserDB){
        const newUser = new UserModel(user);
        const result = await newUser.save();
        return result._id;
    }
    async delete(id: ObjectId) {
        await UserModel.deleteOne({_id: id});
    }
    async  updateConfirmation(_id: ObjectId) {
        await UserModel.updateOne({_id: _id}, {
            $set: {
                "emailConfirmation.isConfirmed": true,
            }
        })
    }
    async  updateConfirmationCode(_id: ObjectId, confirmationCode: string, expirationDate: Date) {
        await UserModel.updateOne({_id: _id}, {
            $set: {
                "emailConfirmation.confirmationCode": confirmationCode,
                "emailConfirmation.expirationDate": expirationDate,
                "emailConfirmation.isConfirmed": false,
            }
        })
    }
    async  updatePasswordHash(_id: ObjectId, passwordHash: string) {
        await UserModel.updateOne({_id: _id}, {
            $set: {
                "accountData.passwordHash": passwordHash
            }
        })
    }
    async findByID(id: ObjectId) {
        return UserModel.findOne({_id: id});
    }
}