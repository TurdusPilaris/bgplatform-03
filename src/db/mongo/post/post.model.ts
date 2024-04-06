import {HydratedDocument, model, Model} from "mongoose";
import {WithId} from "mongodb";
import {PostDBMongoType} from "../../../input-output-types/inputOutputTypesMongo";
import mongoose from "mongoose";

type PostModel = Model<WithId<PostDBMongoType>>

export type PostDocument = HydratedDocument<WithId<PostDBMongoType>>
export const PostSchema = new mongoose.Schema<WithId<PostDBMongoType>>({

    title:{type: String, required: true, max: 30},
    shortDescription:{type: String, required: true, max: 100},
    content:{type: String, required: true, max: 1000},
    blogId:{type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String},

})

export const PostModel = model<WithId<PostDBMongoType>, PostModel>('posts', PostSchema);