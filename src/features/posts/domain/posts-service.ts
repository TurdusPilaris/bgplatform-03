import {ObjectId} from "mongodb";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {PaginatorPostType, TypePostViewModel} from "../../../input-output-types/posts/outputTypes";

import {BlogsQueryRepository} from "../../blogs/repositories/blogQueryRepository";
import {PostDocument, PostModel} from "./postModel";
import {ResultStatus} from "../../../common/types/resultCode";
import {ResultObject} from "../../../common/types/result.types";
import {PostsQueryRepository} from "../repositories/postsQueryRepository";
import {HelperQueryTypePost} from "../../../input-output-types/inputTypes";
import {PostsRepository} from "../repositories/postsRepository";
import {BlogsRepository} from "../../blogs/repositories/blogsRepository";
import {injectable} from "inversify";
import {likeStatus} from "../../../input-output-types/feedBacks/feedBacka.classes";
import {FeedBacksRepository} from "../../feedBacks/reepositories/feedBacksRepository";
import {LikesModel} from "../../feedBacks/domain/likes.entity";
import {feedBacksRepository, usersRepository} from "../../../composition-root";

@injectable()
export class PostsService{

    constructor(
        protected postsRepository: PostsRepository,
        protected postsQueryRepository: PostsQueryRepository,
        protected blogsRepository: BlogsRepository,
        protected blogsQueryRepository: BlogsQueryRepository,
        protected feedBacksRepository: FeedBacksRepository
    ) {
    }

    async create(dto: TypePostInputModelModel, userId: string | null): Promise<ResultObject<TypePostViewModel | null>> {

        const foundedBlog = await this.blogsQueryRepository.findForOutput(new ObjectId(dto.blogId));

        const newPost = new PostModel(dto);
        newPost.createdAt = new Date();
        newPost.blogName = foundedBlog!.name;
        newPost.likesInfo.countLikes = 0;
        newPost.likesInfo.countDislikes = 0;
        newPost.likesInfo.myStatus = likeStatus.None;

        const createdPostID = await this.postsRepository.save(newPost);

        if (!createdPostID) {
            return {
                status: ResultStatus.InternalServerError,
                data: null
            }
        }

        const createdPost = await this.postsQueryRepository.findForOutput(new ObjectId(createdPostID), userId);

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

        const foundPost = await this.postsRepository.findById(new ObjectId(id));

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

    async updatePost(id: string, dto: TypePostInputModelModel, userId: string | null): Promise<ResultObject<TypePostViewModel | null>> {

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

        const updatedPost = await this.postsQueryRepository.findForOutput(foundedPost._id, userId)

        return {
            status: ResultStatus.Success,
            data: updatedPost
        }
    }

    async getAllPosts(query: HelperQueryTypePost, userId: string | null): Promise<ResultObject<PaginatorPostType>> {

        const allPostWithPaginator = await this.postsQueryRepository.getAllPosts(query, userId)

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

        const user = await usersRepository.findByID(new ObjectId(userId));

        //проверяем был ли создан лайк
        if (!foundedLikes) {

            //если нет, то создаем новый лайк и сохраняем его
            const newLike = LikesModel.createLike(new ObjectId(id), userId, user!.accountData.userName, newStatusLike);
            await this.feedBacksRepository.saveLikes(newLike);

            //в пост добавляем количество лайков по статусу

            const lastThreeLikes = await feedBacksRepository.findThreeLastLikesByParent(post._id);

            console.log("lastThreeLikes----------------", lastThreeLikes);
            let resultLastThreeLikes: { addedAt: Date; login: string; userId: string }[] = [];

            if (lastThreeLikes) {
                resultLastThreeLikes = lastThreeLikes.map(function (newestLikes) {
                        return {
                            userId: newestLikes.userID,
                            addedAt: newestLikes.updatedAt,
                            login: newestLikes.login
                        }
                    }
                )
            }
            post.addCountLikes(newStatusLike, resultLastThreeLikes);
            await this.postsRepository.save(post);

            {
                return {
                    status: ResultStatus.Success,
                    data: null
                }
            }
        } else {
            //сохранили старый статус лайка для пересчета в комментарии
            const oldStatusLike = foundedLikes.statusLike;

            //установили новый статус лайка и обновили дату изменения лайка
            foundedLikes.putNewLike(newStatusLike);
            await this.feedBacksRepository.saveLikes(foundedLikes);

            //пересчитаем количество если отличаются новй статус от старого
            if (oldStatusLike !== newStatusLike) {

                const lastThreeLikes = await feedBacksRepository.findThreeLastLikesByParent(post._id);

                console.log("lastThreeLikes----------------", lastThreeLikes);
                let resultLastThreeLikes: { addedAt: Date; login: string; userId: string }[] = [];

                if (lastThreeLikes) {
                    resultLastThreeLikes = lastThreeLikes.map(function (newestLikes) {
                            return {
                                userId: newestLikes.userID,
                                addedAt: newestLikes.updatedAt,
                                login: newestLikes.login
                            }
                        }
                    )
                }
                post.recountLikes(oldStatusLike, newStatusLike, resultLastThreeLikes)
                await this.postsRepository.save(post);

            }

            {
                return {
                    status: ResultStatus.Success,
                    data: null
                }
            }
        }
    }
}
