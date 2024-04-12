import {WithId} from "mongodb";
import {HydratedDocument, model, Model, Schema} from "mongoose";
import {CommentDB} from "../../../input-output-types/inputOutputTypesMongo";

type CommentModel = Model<WithId<CommentDB>>;

export type CommentDocument = HydratedDocument<WithId<CommentDB>>;

export const CommentSchema = new Schema<WithId<CommentDB>>({
    content: {type: String, required: true, max: 300, min: 20},
    postId:{type: String, required: true},
    commentatorInfo:{
        userId: {type: String},
        userLogin: {type: String}
    },
    createdAt: String
})

export const CommentModel = model<WithId<CommentDB>, CommentModel>('comments', CommentSchema)
