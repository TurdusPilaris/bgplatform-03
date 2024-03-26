import {
    CommentDBMongoTypeWithoutID,
} from "../../../input-output-types/inputOutputTypesMongo";
import {ObjectId} from "mongodb";
import {userQueryRepository} from "../../users/repositories/userQueryRepository";
import {commentMongoRepository} from "../reepositories/commentMongoRepository";
import {CommentInputModelType} from "../../../input-output-types/comments/inputTypes";

export const feedbacksService = {

    async createComment(comment: string, postId: string, userId: string) {

        console.log("Im in feedback service")
        const user = await userQueryRepository.findForOutput(new ObjectId(userId));
        console.log("Im in feedback service user")
        const commentInput: CommentDBMongoTypeWithoutID = {
            content: comment,
            postId: postId,
            commentatorInfo: {
                userId: userId.toString(),
                userLogin: user!.login
            },
            createdAt: new Date().toISOString()
        }

        return commentMongoRepository.create(commentInput);

    },

    async deleteComment(id: ObjectId) {

        await commentMongoRepository.deleteComment(id);

    },
    async updateComment(id: ObjectId, input: CommentInputModelType) {

        await commentMongoRepository.updateComment(id, input);

    },
}