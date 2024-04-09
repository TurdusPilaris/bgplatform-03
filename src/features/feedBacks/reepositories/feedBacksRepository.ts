import {CommentDocument, CommentModel} from "../../../db/mongo/comment/comment.model";
import {ObjectId} from "mongodb";
import { PostModel} from "../../../db/mongo/post/post.model";
import {CommentInputModelType} from "../../../input-output-types/comments/inputTypes";

export const feedBacksRepository = {
    async saveComment(comment: CommentDocument){

        const result = await comment.save();
        return result._id;
    },
    async findById(id: ObjectId): Promise<CommentDocument| null> {
        return CommentModel.findOne({_id: id})
    },
    async updateComment(comment: CommentDocument, dto: CommentInputModelType) {

        comment.content = dto.content;
        await comment.save();

    },
    async deleteComment(id: ObjectId): Promise<boolean> {
        const res = await CommentModel.deleteOne({_id: id})
        return res.deletedCount === 1
    },
}