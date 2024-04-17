import *as mongoose from "mongoose";
import {Model, model, HydratedDocument} from "mongoose";
import {LikesForCommentsType} from "../../../input-output-types/feedBacks/feedBacka.classes";
import {ObjectId, WithId} from "mongodb";


type LikesForCommentsModel = Model<WithId<LikesForCommentsType>>

export type LikesForCommentsDocument = HydratedDocument<WithId<LikesForCommentsType>>

export const LikesForCommentsSchema = new mongoose.Schema<WithId<LikesForCommentsType>>({
    commentID: { type: mongoose.Schema.Types.ObjectId},
    userID: {type: String},
    statusLike: {
        type: String,
        enum: ['Like', 'Dislike', 'None']
    },
    createdAt: {type: Date},
    updatedAt: {type: Date},
})

export const LikesForCommentsModel = model<WithId<LikesForCommentsType>, LikesForCommentsModel>('likesForComments', LikesForCommentsSchema);