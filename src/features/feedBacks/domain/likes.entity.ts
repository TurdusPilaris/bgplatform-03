import *as mongoose from "mongoose";
import {Model, model, HydratedDocument} from "mongoose";
import {LikesType, likeStatus} from "../../../input-output-types/feedBacks/feedBacka.classes";
import {ObjectId, WithId} from "mongodb";
import {usersQueryRepository, usersRepository} from "../../../composition-root";

type LikesStatics = typeof likesStatics;
type LikesMethods = typeof likesMethods;
type LikesModel = Model<WithId<LikesType>, {}, LikesMethods> & LikesStatics;

export type LikesDocument = HydratedDocument<WithId<LikesType>, LikesMethods>

export const LikesSchema = new mongoose.Schema<WithId<LikesType>>({
        parentID: {type: mongoose.Schema.Types.ObjectId},
        userID: {type: String},
        login: {type: String},
        statusLike: {
            type: String,
            enum: ['Like', 'Dislike', 'None']
        },
        createdAt: {type: Date},
        updatedAt: {type: Date},
    },
    {optimisticConcurrency: true})

const likesStatics = {

    createLike(parentID: ObjectId, userID: string, statusLike: likeStatus) {

        const user = await usersRepository.findByID(new ObjectId(userID));
        const like = new LikesModel() as LikesDocument;
        like.parentID = parentID;
        like.userID = userID;
        like.login = user.accountData.userName;
        like.statusLike = statusLike;

        like.createdAt = new Date();
        like.updatedAt = new Date();

        return like;
    }
}

const likesMethods = {

    putNewLike(newStatusLike: likeStatus) {
        (this as LikesDocument).statusLike = newStatusLike;
        (this as LikesDocument).updatedAt = new Date();
    }
}
LikesSchema.statics = likesStatics;
LikesSchema.methods = likesMethods;
export const LikesModel = model<WithId<LikesType>, LikesModel>('likes', LikesSchema)