import {HydratedDocument, model, Model} from "mongoose";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import {LikesInfoType, likeStatus} from "../../../input-output-types/feedBacks/feedBacka.classes";
import {CommentDocument} from "../../feedBacks/domain/commentModel";

export class PostDBType {
    _id: ObjectId
    createdAt: Date
    likesInfo: LikesInfoType

    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string | undefined,
        public blogName: string | undefined,
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

type PostStatics = typeof postStatics;
type PostMethods = typeof postMethods;

type PostModel = Model<PostDBType, {}, PostMethods> & PostStatics

export type PostDocument = HydratedDocument<PostDBType, PostMethods>
export const PostSchema = new mongoose.Schema<PostDBType, PostModel, PostMethods>({

    title:{type: String, required: true, max: 30},
    shortDescription:{type: String, required: true, max: 100},
    content:{type: String, required: true, max: 1000},
    blogId:{type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: Date},

})

const postStatics = {}
const postMethods = {

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

        (this as PostDocument).likesInfo.countLikes += countLikes;
        (this as PostDocument).likesInfo.countDislikes += countDislikes;

    }
}


PostSchema.methods = postMethods;
PostSchema.statics = postStatics;

export const PostModel = model<PostDBType, PostModel>('posts', PostSchema);