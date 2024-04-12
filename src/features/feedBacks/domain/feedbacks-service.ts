import {ObjectId} from "mongodb";
import {UsersQueryRepository} from "../../users/repositories/userQueryRepository";
import {CommentInputModelType} from "../../../input-output-types/comments/inputTypes";
import {PostsRepository, } from "../../posts/repositories/postsRepository";
import {ResultStatus} from "../../../common/types/resultCode";
import {ResultObject} from "../../../common/types/result.types";
import {CommentViewModelType} from "../../../input-output-types/comments/outputTypes";
import {FeedBacksRepository} from "../reepositories/feedBacksRepository";
import {CommentDB} from "../../../input-output-types/inputOutputTypesMongo";
import {FeedBacksQueryRepository} from "../reepositories/feedBackQueryRepository";

export class FeedbacksService {
    constructor(
        protected feedBacksRepository: FeedBacksRepository,
        protected feedBacksQueryRepository: FeedBacksQueryRepository,
        protected usersQueryRepository: UsersQueryRepository,
        protected postsRepository: PostsRepository) {}
    async createComment(comment: string, postId: string, userId: string): Promise<ResultObject<CommentViewModelType | null>> {

        const post = await this.postsRepository.findById(new ObjectId(postId));

        if (!post) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const user = await this.usersQueryRepository.findForOutput(new ObjectId(userId));

        //lets go classes
        let newComment = new CommentDB(
            comment,
            postId,
            {userId:  user!.id, userLogin: user!.login}
        )
        // const newComment = new CommentModel();
        // newComment.content = comment;
        // newComment.postId = postId;
        // newComment.commentatorInfo.userId = user!.id;
        // newComment.commentatorInfo.userLogin = user!.login;
        // newComment.createdAt = new Date().toISOString();

        const createdCommentId = await this.feedBacksRepository.saveComment(newComment);

        if (!createdCommentId) {
            return {
                status: ResultStatus.InternalServerError,
                data: null
            }
        }

        const commentForOutput = await this.feedBacksQueryRepository.findForOutput(createdCommentId);

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
        const foundedComment = await this.feedBacksRepository.findById(new ObjectId(id))

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

        await this.feedBacksRepository.deleteComment(new ObjectId(id));

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

        const foundedComment = await this.feedBacksRepository.findById(new ObjectId(id))

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

        await this.feedBacksRepository.updateComment(foundedComment, dto);

        return {
            status: ResultStatus.Success,
            data: null
        }

    }
}
