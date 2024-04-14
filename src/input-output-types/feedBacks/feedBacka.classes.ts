import {ObjectId} from "mongodb";

export enum likeStatus{
    Like = 'Like',
    Dislike = 'Dislike',
    None = 'None'
}

export type CommentatorInfoType = {
    userId: string,
    userLogin: string
}
export class CommentDB {
    _id: ObjectId
    createdAt: string

    constructor(
        public content: string,
        public postId: string,
        public commentatorInfo: CommentatorInfoType
    ) {
        this._id = new ObjectId(),
            this.createdAt = new Date().toISOString()
    }
}

export type LikesForCommentsType = {
    commentID:ObjectId;
    userID: string,
    statusLike: likeStatus
}


export class LikesForCommentsDB{
    _id: ObjectId
    constructor(
        public commentID: string,
        public userID: string,
        public statusLike: likeStatus
    ) {
        this._id = new ObjectId()
    }
}