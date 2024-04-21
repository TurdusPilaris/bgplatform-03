import {ObjectId} from "mongodb";
import {UsersQueryRepository} from "../../users/repositories/userQueryRepository";
import {CommentInputModelType} from "../../../input-output-types/feedBacks/inputTypes";
import {PostsRepository,} from "../../posts/repositories/postsRepository";
import {ResultStatus} from "../../../common/types/resultCode";
import {ResultObject} from "../../../common/types/result.types";
import {CommentViewModelType} from "../../../input-output-types/feedBacks/outputTypes";
import {FeedBacksRepository} from "../reepositories/feedBacksRepository";
import {FeedBacksQueryRepository} from "../reepositories/feedBackQueryRepository";
import {likeStatus} from "../../../input-output-types/feedBacks/feedBacka.classes";
import {injectable} from "inversify";
import {CommentDB} from "./commentModel";
import {LikesModel} from "./likes.entity";
import {usersRepository} from "../../../composition-root";

@injectable()
export class FeedbacksService {
    constructor(
        protected feedBacksRepository: FeedBacksRepository,
        protected feedBacksQueryRepository: FeedBacksQueryRepository,
        protected usersQueryRepository: UsersQueryRepository,
        protected postsRepository: PostsRepository) {
    }

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
            {userId: user!.id, userLogin: user!.login}
        )

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
        const foundedComment = await this.feedBacksRepository.findCommentById(new ObjectId(id))

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

        const foundedComment = await this.feedBacksRepository.findCommentById(new ObjectId(id))

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

    async updateLikeStatus(id: string, userId: string | null, likesStatusBody: string): Promise<ResultObject<null>> {

        // @ts-ignore
        const newStatusLike = likeStatus[likesStatusBody] as likeStatus;

        if (!newStatusLike) {
            return {
                status: ResultStatus.BadRequest,
                errorField: 'likeStatus',
                errorMessage: 'Invalid field',
                data: null
            }
        }

        if (!userId) {
            return {
                status: ResultStatus.Unauthorized,
                data: null
            }
        }

        const comment = await this.feedBacksQueryRepository.findCommentById(new ObjectId(id));

        if (!comment) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const foundedLikes = await this.feedBacksRepository.findLikesByUserAndParent(new ObjectId(id), userId);

        const user = await usersRepository.findByID(new ObjectId(userId));

        //проверяем был ли создан лайк
        if (!foundedLikes) {

            //если нет, то создаем новый лайк и сохраняем его
            const newLike = LikesModel.createLike(new ObjectId(id), userId, user!.accountData.userName, newStatusLike);
            await this.feedBacksRepository.saveLikes(newLike);

            //в комментарий добавляем количество лайков по статусу
            comment.addCountLikes(newStatusLike);
            await this.feedBacksRepository.saveComment(comment);


        } else {

            //сохранили старый статус лайка для пересчета в комментарии
            const oldStatusLike = foundedLikes.statusLike;

            //установили новый статус лайка и обновили дату изменения лайка
            foundedLikes.putNewLike(newStatusLike);
            await this.feedBacksRepository.saveLikes(foundedLikes);

            //пересчитаем количество если отличаются новй статус от старого
            if (oldStatusLike !== newStatusLike) {
                comment.recountLikes(oldStatusLike, newStatusLike)
                await this.feedBacksRepository.saveComment(comment);
            }
        }

        {
            return {
                status: ResultStatus.Success,
                data: null
            }
        }
    }
}
