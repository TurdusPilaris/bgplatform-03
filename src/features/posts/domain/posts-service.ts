import {ObjectId} from "mongodb";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {PaginatorPostType, TypePostViewModel} from "../../../input-output-types/posts/outputTypes";

import {BlogsQueryRepository} from "../../blogs/repositories/blogQueryRepository";
import {PostModel} from "../../../db/mongo/post/post.model";
import {ResultStatus} from "../../../common/types/resultCode";
import {ResultObject} from "../../../common/types/result.types";
import {PostsQueryRepository} from "../repositories/postsQueryRepository";
import {HelperQueryTypePost} from "../../../input-output-types/inputTypes";
import {PostsRepository} from "../repositories/postsRepository";
import {BlogsRepository} from "../../blogs/repositories/blogsRepository";

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
        newPost.createdAt = new Date().toISOString();
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

}

