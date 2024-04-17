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
    myStatus: likeStatus.None
}

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

export type LikesForCommentsType = {
    commentID: ObjectId;
    userID: string,
    statusLike: likeStatus,
    createdAt: Date,
    updatedAt: Date
}
