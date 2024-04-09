// import *as mongoose from "mongoose";
// import { WithId} from "mongodb";
// import {Model, model, HydratedDocument} from "mongoose";
// import {BlogDBMongoType, UserAccountDBMongoType} from "../../../input-output-types/inputOutputTypesMongo";
//
// type UserModel = Model<WithId<UserAccountDBMongoType>>
//
// export type BlogDocument = HydratedDocument<WithId<BlogDBMongoType>>
//
// export const UserSchema = new mongoose.Schema<WithId<BlogDBMongoType>>({
//     name:{type: String, required: true, max: 15},
//     description:{type: String, required: true, max: 500},
//     websiteUrl: {type: String, required: true, max: 100},
//     createdAt: {type: String},
//     isMembership: {type: Boolean, default: false},
//
// })
//
// export const BlogModel = model<WithId<BlogDBMongoType>, BlogModel>('blogs', BlogSchema);