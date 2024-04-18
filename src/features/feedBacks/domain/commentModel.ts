import {ObjectId, WithId} from "mongodb";
import {HydratedDocument, model, Model, Schema} from "mongoose";
import {
    CommentatorInfoType,
    LikesInfoType,
    likeStatus
} from "../../../input-output-types/feedBacks/feedBacka.classes";

export class CommentDB {
    _id: ObjectId
    createdAt: Date
    likesInfo: LikesInfoType

    constructor(
        public content: string,
        public postId: string,
        public commentatorInfo: CommentatorInfoType
    ) {
        this._id = new ObjectId(),
            this.createdAt = new Date(),
            this.likesInfo = {
                countLikes: 0,
                countDislikes: 0,
                myStatus: likeStatus.None
            }
    }
}

type CommentStatics = typeof commentStatics;
type CommentMethods = typeof commentMethods;

type CommentModel = Model<WithId<CommentDB>, {}, CommentMethods> & CommentStatics;

export type CommentDocument = HydratedDocument<WithId<CommentDB>, CommentMethods>;

export const CommentSchema = new Schema<WithId<CommentDB>, CommentModel, CommentMethods>({
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
    },
    {optimisticConcurrency: true})

const commentStatics = {}
const commentMethods = {

    addCountLikes(newStatusLike: likeStatus) {

        if (newStatusLike === likeStatus.Like) {
            (this as CommentDocument).likesInfo.countLikes += 1;
        }
        if (newStatusLike === likeStatus.Dislike) {
            (this as CommentDocument).likesInfo.countDislikes += 1;
        }

    },
    recountLikes(oldStatusLike: likeStatus, newStatusLike: likeStatus) {

        let countLikes = 0;
        let countDislikes = 0;

        if (oldStatusLike === likeStatus.None) {
            if (newStatusLike === likeStatus.Like) {
                countLikes = 1;
                countDislikes = 0;
            }
            if (newStatusLike === likeStatus.Dislike) {
                countLikes = 0;
                countDislikes = 1;
            }
        } else if (oldStatusLike === likeStatus.Like) {
            countLikes = -1;
            if (newStatusLike === likeStatus.None) {
                countDislikes = 0;
            }
            if (newStatusLike === likeStatus.Dislike) {
                countDislikes = 1;
            }
        } else if (oldStatusLike === likeStatus.Dislike) {
            countDislikes = -1;
            if (newStatusLike === likeStatus.None) {
                countLikes = 0;
            }
            if (newStatusLike === likeStatus.Like) {
                countLikes = 1;
            }
        }

        (this as CommentDocument).likesInfo.countLikes += countLikes;
        (this as CommentDocument).likesInfo.countDislikes += countDislikes;

    }
}
CommentSchema.methods = commentMethods;
CommentSchema.statics = commentStatics;
export const CommentModel = model<WithId<CommentDB>, CommentModel>('comments', CommentSchema)
