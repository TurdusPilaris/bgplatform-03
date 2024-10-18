import mongoose, {HydratedDocument, model, Model} from "mongoose";
import {ObjectId} from "mongodb";
import {LikesInfoType, likeStatus} from "../../../input-output-types/feedBacks/feedBacka.classes";
import {feedBacksRepository} from "../../../composition-root";
import LastNewline from "nodemailer/lib/mime-node/last-newline";


export type NewestLikesType = {
    addedAt: Date;
    userId: string,
    login: string
}
export type NewestLikeType = {
    newestLikes: NewestLikesType[]
}

export class PostDBType {
    _id: ObjectId
    createdAt: Date

    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string | undefined,
        public blogName: string | undefined,
        public likesInfo: LikesInfoType&NewestLikeType,
        // public newestLikes: NewestLikesType[]

    ) {
        this._id = new ObjectId(),
            this.createdAt = new Date()
    }
}

type PostStatics = typeof postStatics;
type PostMethods = typeof postMethods;

type PostModel = Model<PostDBType, {}, PostMethods> & PostStatics

export type PostDocument = HydratedDocument<PostDBType, PostMethods>

export const NewLikesSchema = new mongoose.Schema({
    addedAt: {type: Date},
    userId: {type: String},
    login: {type: String},
})
export const PostSchema = new mongoose.Schema<PostDBType, PostModel, PostMethods>({

    title: {type: String, required: true, max: 30},
    shortDescription: {type: String, required: true, max: 100},
    content: {type: String, required: true, max: 1000},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: Date},
    likesInfo: {
        countLikes: {type: Number, default: 0},
        countDislikes: {type: Number, default: 0},
        myStatus: {
            type: String,
            enum: ['Like', 'Dislike', 'None'],
            default: likeStatus.None
        },
        newestLikes: {default: [], type: [NewLikesSchema]}
    },

}, {optimisticConcurrency: true})

const postStatics = {}
const postMethods = {

    async addCountLikes(newStatusLike: likeStatus, resultLastThreeLikes: NewestLikesType[]) {

        if (newStatusLike === likeStatus.Like) {
            (this as PostDocument).likesInfo.countLikes += 1;
        }
        if (newStatusLike === likeStatus.Dislike) {
            (this as PostDocument).likesInfo.countDislikes += 1;
        }

        (this as PostDocument).likesInfo.newestLikes = [];
        (this as PostDocument).likesInfo.newestLikes.push(...resultLastThreeLikes);
    },

    async recountLikes(oldStatusLike: likeStatus, newStatusLike: likeStatus, resultLastThreeLikes: NewestLikesType[]) {

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

        (this as PostDocument).likesInfo.newestLikes = [];
        (this as PostDocument).likesInfo.newestLikes.push(...resultLastThreeLikes);

    }
}


PostSchema.methods = postMethods;
PostSchema.statics = postStatics;

export const PostModel = model<PostDBType, PostModel>('posts', PostSchema);