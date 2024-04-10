import {ObjectId} from "mongodb";
import {userQueryRepository} from "../../users/repositories/userQueryRepository";
import {CommentInputModelType} from "../../../input-output-types/comments/inputTypes";
import {postsRepository} from "../../posts/repositories/postsRepository";
import {ResultStatus} from "../../../common/types/resultCode";
import {ResultObject} from "../../../common/types/result.types";
import {CommentViewModelType} from "../../../input-output-types/comments/outputTypes";
import {feedBacksRepository} from "../reepositories/feedBacksRepository";
import {commentQueryRepository} from "../reepositories/commentQueryRepository";
import {CommentDBType2} from "../../../input-output-types/inputOutputTypesMongo";

class FeedbacksService {
    async createComment(comment: string, postId: string, userId: string): Promise<ResultObject<CommentViewModelType | null>> {

        const post = await postsRepository.findById(new ObjectId(postId));

        if (!post) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const user = await userQueryRepository.findForOutput(new ObjectId(userId));

        //lets go classes
        let newComment = new CommentDBType2(
            new ObjectId(),
            comment,
            postId,
            {userId:  user!.id, userLogin: user!.login},
            new Date().toISOString()
        )
        // const newComment = new CommentModel();
        // newComment.content = comment;
        // newComment.postId = postId;
        // newComment.commentatorInfo.userId = user!.id;
        // newComment.commentatorInfo.userLogin = user!.login;
        // newComment.createdAt = new Date().toISOString();

        const createdCommentId = await feedBacksRepository.saveComment(newComment);

        if (!createdCommentId) {
            return {
                status: ResultStatus.InternalServerError,
                data: null
            }
        }

        const commentForOutput = await commentQueryRepository.findForOutput(createdCommentId);

        return {
            status: ResultStatus.Success,
            data: commentForOutput
        }

    }

    async deleteComment(id: string, userId: string) {

        if (!ObjectId.isValid(id)) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }
        const foundedComment = await feedBacksRepository.findById(new ObjectId(id))

        if (!foundedComment) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        if (foundedComment.commentatorInfo.userId !== userId) {
            return {
                status: ResultStatus.Forbidden,
                data: null
            }
        }

        await feedBacksRepository.deleteComment(new ObjectId(id));

        return {
            status: ResultStatus.Success,
            data: null
        }

    }
    async updateComment(id: string, dto: CommentInputModelType, userId: string) {

        if (!ObjectId.isValid(id)) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const foundedComment = await feedBacksRepository.findById(new ObjectId(id))

        if (!foundedComment) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        if (foundedComment.commentatorInfo.userId !== userId) {
            return {
                status: ResultStatus.Forbidden,
                data: null
            }
        }

        await feedBacksRepository.updateComment(foundedComment, dto);

        return {
            status: ResultStatus.Success,
            data: null
        }

    }
}

/////////////////////////////////////////////////////////////
export const feedbacksService = new FeedbacksService();