import {WithId} from "mongodb";
import {HydratedDocument, model, Model, Schema} from "mongoose";
import {CommentDB, likeStatus} from "../../../input-output-types/feedBacks/feedBacka.classes";


type CommentModel = Model<WithId<CommentDB>>;

export type CommentDocument = HydratedDocument<WithId<CommentDB>>;

export const CommentSchema = new Schema<WithId<CommentDB>>({
    content: {type: String, required: true, max: 300, min: 20},
    postId: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String},
        userLogin: {type: String}
    },
    createdAt: {type: Date},
    likesInfo: {
        countLikes: {type: Number},
        countDislikes: {type: Number},
        myStatus: {
            type: String,
            enum: ['Like', 'Dislike', 'None']
        }
    }
})

export const CommentModel = model<WithId<CommentDB>, CommentModel>('comments', CommentSchema)
