import {
    InsertedInfoType, UserAccountDBMongoType
} from "../../../input-output-types/inputOutputTypesMongo";
import { userCollection} from "../../../db/mongo/mongo-db";
import {ObjectId} from "mongodb";
import {userQueryRepository} from "./userQueryRepository";


export const userMongoRepository = {
    async create(input: UserAccountDBMongoType) {

        try {
            const insertedInfo = await userCollection.insertOne(input);
            return insertedInfo as InsertedInfoType;
        } catch (e) {
            return undefined;
        }

    },

    async find(id: ObjectId) {
        return (await userCollection.findOne({_id: id}));

    },
    async findForOutput(id: ObjectId) {
        const foundUser =  await this.find(id);
        if(!foundUser) {return undefined}
        return userQueryRepository.mapToOutput(foundUser);
    },

    async delete(id: ObjectId) {
        await userCollection.deleteOne({_id: id});
    },
    async  updateConfirmation(_id: ObjectId) {
        await userCollection.updateOne({_id: _id}, {
            $set: {
                "emailConfirmation.isConfirmed": true,
            }
        })
    }
    ,
    async  updateConfirmationCode(_id: ObjectId, confirmationCode: string, expirationDate: Date) {
       await userCollection.updateOne({_id: _id}, {
            $set: {
                "emailConfirmation.confirmationCode": confirmationCode,
                "emailConfirmation.expirationDate": expirationDate,
                "emailConfirmation.isConfirmed": false,
            }
        })
    }
}