import *as mongoose from "mongoose";
import { WithId} from "mongodb";
import {Model, model, HydratedDocument} from "mongoose";
import {LikesForCommentsType} from "../../../input-output-types/inputOutputTypesMongo";

type LikesForCommentsModel = Model<WithId<LikesForCommentsType>>

export type LikesForCommentsDocument = HydratedDocument<WithId<LikesForCommentsType>>

export const LikesForCommentsSchema = new mongoose.Schema<WithId<LikesForCommentsType>>({
    commentID: {type: String},
    userID: {type: String},
    statusLike: {type: Date}
})

export const CustomRateLimitModel = model<WithId<LikesForCommentsType>, LikesForCommentsModel>('likesForComments', LikesForCommentsSchema);