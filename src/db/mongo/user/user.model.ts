import *as mongoose from "mongoose";
import { WithId} from "mongodb";
import {Model, model, HydratedDocument} from "mongoose";

 import {UserAccountDBType} from "../../../input-output-types/inputOutputTypesMongo";

type UserModel = Model<WithId<UserAccountDBType>>

export type UserDocument = HydratedDocument<WithId<UserAccountDBType>>

 export const UserSchema = new mongoose.Schema<WithId<UserAccountDBType>>({
        accountData:{
            userName: {type: String, required: true},
            email:{type: String, required: true},
            passwordHash:{type: String, required: true},
            createdAt: {type: String}
        },
        emailConfirmation: {
            confirmationCode: {type: String},
            expirationDate: {type: Date},
            isConfirmed: {type: Boolean, default: false}
        }
 })

 export const UserModel = model<WithId<UserAccountDBType>, UserModel>('users', UserSchema);