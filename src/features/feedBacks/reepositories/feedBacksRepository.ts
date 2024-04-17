import {CommentDocument, CommentModel} from "../../../db/mongo/comment/comment.model";
import {ObjectId} from "mongodb";
import {CommentInputModelType} from "../../../input-output-types/feedBacks/inputTypes";
import {
    LikesForCommentsDocument,
    LikesForCommentsModel
} from "../../../db/mongo/likesForComment/likesForComments.model";
import {CommentDB, LikesForCommentsDB} from "../../../input-output-types/feedBacks/feedBacka.classes";

export class FeedBacksRepository{
    async saveComment(comment: CommentDB){

        let newComment = new CommentModel(comment);

        const result = await newComment.save();
        return result._id;
    }
    async findCommentById(id: ObjectId): Promise<CommentDocument| null> {
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

    async findLikesByUserAnPost(commentID: ObjectId, userId: string): Promise<LikesForCommentsDocument| null> {
        return LikesForCommentsModel.findOne({commentID: commentID, userID: userId})
    }
    async deleteLike(id: ObjectId) {
        await LikesForCommentsModel.deleteOne({_id: id})
    }

    async deleteLikesForUserAndComment(userID: string, commentID: string) {
        await LikesForCommentsModel.deleteMany({commentID: commentID, userID: userID});
    }

    async saveLikes(newLike: LikesForCommentsDB) {
        let newLikes = new LikesForCommentsModel(newLike);

        const result = await newLikes.save();
        return result._id;
    }

    async addLikesForComment(comment: CommentDocument, countLikes: number, countDislikes: number) {
        // comment.content = dto.content;
        comment.likesInfo.countLikes = comment.likesInfo.countLikes + countLikes;
        comment.likesInfo.countDislikes = comment.likesInfo.countDislikes + countDislikes;
        await comment.save();
    }
}