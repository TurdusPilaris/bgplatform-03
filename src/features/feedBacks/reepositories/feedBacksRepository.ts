import {CommentDB, CommentDocument, CommentModel} from "../domain/commentModel";
import {ObjectId} from "mongodb";
import {CommentInputModelType} from "../../../input-output-types/feedBacks/inputTypes";
import {injectable} from "inversify";

import {LikesDocument, LikesModel} from "../domain/likes.entity";
import {likeStatus} from "../../../input-output-types/feedBacks/feedBacka.classes";

@injectable()
export class FeedBacksRepository {
    async saveComment(comment: CommentDB) {

        let newComment = new CommentModel(comment);

        const result = await newComment.save();
        return result._id;
    }

    async findCommentById(id: ObjectId): Promise<CommentDocument | null> {
        return CommentModel.findOne({_id: id})
    }

    async updateComment(comment: CommentDocument, dto: CommentInputModelType) {

        comment.content = dto.content;
        await comment.save();

    }

    async deleteComment(id: ObjectId): Promise<boolean> {
        const res = await CommentModel.deleteOne({_id: id})
        return res.deletedCount === 1
    }

    async findLikesByUserAndParent(parentID: ObjectId, userId: string): Promise<LikesDocument | null> {
        return LikesModel.findOne({parentID: parentID, userID: userId})
    }

    async findThreeLastLikesByParent(parentID: ObjectId): Promise<LikesDocument[] | null> {
        return LikesModel.find({parentID: parentID, statusLike: likeStatus.Like}).sort({createdAt: -1}).limit(3).lean()
    }

    async saveLikes(newLike: LikesDocument) {

        await newLike.save();

    }

}