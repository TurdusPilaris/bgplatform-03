import {ObjectId} from "mongodb";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {PaginatorPostType, TypePostViewModel} from "../../../input-output-types/posts/outputTypes";

import {BlogsQueryRepository} from "../../blogs/repositories/blogQueryRepository";
import {PostModel} from "./postModel";
import {ResultStatus} from "../../../common/types/resultCode";
import {ResultObject} from "../../../common/types/result.types";
import {PostsQueryRepository} from "../repositories/postsQueryRepository";
import {HelperQueryTypePost} from "../../../input-output-types/inputTypes";
import {PostsRepository} from "../repositories/postsRepository";
import {BlogsRepository} from "../../blogs/repositories/blogsRepository";
import {injectable} from "inversify";
import {likeStatus} from "../../../input-output-types/feedBacks/feedBacka.classes";
import {LikesForCommentsModel} from "../../feedBacks/domain/likesForComments.entity";
import {LikesForPostsModel} from "../../feedBacks/domain/likesForPostsModel";
@injectable()
export class PostsService{

    constructor(
        protected postsRepository: PostsRepository,
        protected postsQueryRepository: PostsQueryRepository,
        protected blogsRepository: BlogsRepository,
        protected blogsQueryRepository: BlogsQueryRepository
        ) {}
    async create(dto: TypePostInputModelModel): Promise<ResultObject<TypePostViewModel | null>> {

        const foundedBlog = await this.blogsQueryRepository.findForOutput(new ObjectId(dto.blogId));

        const newPost = new PostModel(dto);
        newPost.createdAt = new Date();
        newPost.blogName = foundedBlog!.name;

        const createdPostID = await this.postsRepository.save(newPost);

        if (!createdPostID) {
            return {
                status: ResultStatus.InternalServerError,
                data: null
            }
        }

        const createdPost = await this.postsQueryRepository.findForOutput(new ObjectId(createdPostID));

        if (!createdPost) {
            return {
                status: ResultStatus.InternalServerError,
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            data: createdPost
        }

    }
    async find(id: ObjectId) {

        return this.postsRepository.findById(id);

    }
    async deletePost(id: string): Promise<ResultObject<null>> {

        if (!ObjectId.isValid(id)) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const foundPost = await this.postsQueryRepository.findForOutput(new ObjectId(id));

        if (!foundPost) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const resultOfDelete = await this.postsRepository.deletePost(new ObjectId(id));

        if (!resultOfDelete) {
            return {
                status: ResultStatus.InternalServerError,
                data: null
            }
        }

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    async updatePost(id: string, dto: TypePostInputModelModel): Promise<ResultObject<TypePostViewModel | null>> {

        if (!ObjectId.isValid(id)) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }
        const foundedPost = await this.postsRepository.findById(new ObjectId(id));

        if (!foundedPost) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const blogForPost = await this.blogsRepository.findById(new ObjectId(dto.blogId))
        await this.postsRepository.updatePost(foundedPost, dto, blogForPost);

        const updatedPost = await this.postsQueryRepository.findForOutput(foundedPost._id)

        return {
            status: ResultStatus.Success,
            data: updatedPost
        }
    }
    async getAllPosts(query: HelperQueryTypePost): Promise<ResultObject<PaginatorPostType>> {

        const allPostWithPaginator = await this.postsQueryRepository.getAllPosts(query)

        return {
            status: ResultStatus.Success,
            data: allPostWithPaginator
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

        const post = await this.postsRepository.findById(new ObjectId(id));

        if (!post) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const foundedLikes = await this.feedBacksRepository.findLikesByUserAndParent(new ObjectId(id), userId);

        //проверяем был ли создан лайк
        if (!foundedLikes) {

            //если нет, то создаем новый лайк и сохраняем его
            const newLike = LikesModel.createLike(new ObjectId(id), userId, newStatusLike);
            await this.feedBacksRepository.saveLikes(newLike);

            //в пост добавляем количество лайков по статусу
            post.addCountLikes(newStatusLike);
            await this.postsRepository.save(post);


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

