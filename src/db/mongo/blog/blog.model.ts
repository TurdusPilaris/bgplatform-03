import *as mongoose from "mongoose";
import { WithId} from "mongodb";
import {Model, model, HydratedDocument} from "mongoose";
import {BlogDBMongoType} from "../../../input-output-types/inputOutputTypesMongo";

type BlogModel = Model<WithId<BlogDBMongoType>>

export type BlogDocument = HydratedDocument<WithId<BlogDBMongoType>>

export const BlogSchema = new mongoose.Schema<WithId<BlogDBMongoType>>({
    name:{type: String, required: true, max: 15},
    description:{type: String, required: true, max: 500},
    websiteUrl: {type: String, required: true, max: 100},
    createdAt: {type: String},
    isMembership: {type: Boolean, default: false},

})

export const BlogModel = model<WithId<BlogDBMongoType>, BlogModel>('blogs', BlogSchema);