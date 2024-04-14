import {CommentDocument, CommentModel} from "../../../db/mongo/comment/comment.model";
import {ObjectId} from "mongodb";
import {CommentInputModelType} from "../../../input-output-types/feedBacks/inputTypes";
import {LikesForCommentsModel} from "../../../db/mongo/likesForComment/likesForComments.model";
import {CommentDB, LikesForCommentsDB} from "../../../input-output-types/feedBacks/feedBacka.classes";

export class FeedBacksRepository{
    async saveComment(comment: CommentDB){

        let newComment = new CommentModel(comment);

        const result = await newComment.save();
        return result._id;
    }
    async findById(id: ObjectId): Promise<CommentDocument| null> {
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
}