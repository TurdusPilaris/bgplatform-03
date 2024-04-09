import {ObjectId, WithId} from "mongodb";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {PaginatorPostType, TypePostViewModel} from "../../../input-output-types/posts/outputTypes";

import {blogQueryRepository} from "../../blogs/repositories/blogQueryRepository";
import {PostModel} from "../../../db/mongo/post/post.model";
import {postsRepository} from "../repositories/postsRepository";
import {ResultStatus} from "../../../common/types/resultCode";
import {ResultObject} from "../../../common/types/result.types";
import {PaginatorBlogType, TypeBlogViewModel} from "../../blogs/types/outputTypes";
import {postQueryRepository} from "../repositories/postQueryRepository";
import {HelperQueryTypeBlog, HelperQueryTypePost} from "../../../input-output-types/inputTypes";

export const postsService = {
    async create(dto: TypePostInputModelModel): Promise<ResultObject<TypePostViewModel | null>> {

        const foundedBlog = await blogQueryRepository.findForOutput(new ObjectId(dto.blogId));

        const newPost = new PostModel(dto);
        newPost.createdAt = new Date().toISOString();
        newPost.blogName = foundedBlog!.name;

        const createdPostID = await postsRepository.save(newPost);

        if (!createdPostID) {
            return {
                status: ResultStatus.InternalServerError,
                data: null
            }
        }

        const createdPost = await postQueryRepository.findForOutput(new ObjectId(createdPostID));

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

    },
    async find(id: ObjectId) {

        return postsRepository.findById(id);

    },
    async deletePost(id: string): Promise<ResultObject<null>> {

        if (!ObjectId.isValid(id)) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const foundPost = await postQueryRepository.findForOutput(new ObjectId(id));

        if (!foundPost) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const resultOfDelete = await postsRepository.deletePost(new ObjectId(id));

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
    },
    async updatePost(id: string, dto: TypePostInputModelModel): Promise<ResultObject<TypePostViewModel | null>> {

        if (!ObjectId.isValid(id)) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }
        const foundedPost = await postsRepository.findById(new ObjectId(id));

        if (!foundedPost) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        await postsRepository.updatePost(foundedPost, dto);

        const updatedPost = await postQueryRepository.findForOutput(foundedPost._id)

        return {
            status: ResultStatus.Success,
            data: updatedPost
        }
    },
    async getAllPosts(query: HelperQueryTypePost): Promise<ResultObject<PaginatorPostType>> {

        const allPostWithPaginator = await postQueryRepository.getAllPosts(query)

        return {
            status: ResultStatus.Success,
            data: allPostWithPaginator
        }
    },

}