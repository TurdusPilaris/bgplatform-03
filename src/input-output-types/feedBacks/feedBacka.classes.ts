import {ObjectId} from "mongodb";

export enum likeStatus {
    Like = 'Like',
    Dislike = 'Dislike',
    None = 'None'
}

export type CommentatorInfoType = {
    userId: string,
    userLogin: string
}
export type LikesInfoType = {
    countLikes: number,
    countDislikes: number,
    myStatus: likeStatus
}

export class LikesForCommentsDB {

    _id: ObjectId

    constructor(
        public commentID: ObjectId,
        public userID: string,
        public statusLike: likeStatus,
        public createdAt: Date,
        public updatedAt: Date,
    ) {
        this._id = new ObjectId()
    }

}

export type LikesType = {
    parentID: ObjectId;
    userID: string,
    login: string,
    statusLike: likeStatus,
    createdAt: Date,
    updatedAt: Date
}
