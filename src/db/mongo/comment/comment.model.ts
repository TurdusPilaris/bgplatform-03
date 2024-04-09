import {WithId} from "mongodb";
import {HydratedDocument, model, Model, Schema} from "mongoose";
import {CommentDBType} from "../../../input-output-types/inputOutputTypesMongo";

type CommentModel = Model<WithId<CommentDBType>>;

export type CommentDocument = HydratedDocument<WithId<CommentDBType>>;

export const CommentSchema = new Schema<WithId<CommentDBType>>({
    content: {type: String, required: true, max: 300, min: 20},
    postId:{type: String, required: true},
    commentatorInfo:{
        userId: {type: String},
        userLogin: {type: String}
    },
    createdAt: String
})

export const CommentModel = model<WithId<CommentDBType>, CommentModel>('comments', CommentSchema)
