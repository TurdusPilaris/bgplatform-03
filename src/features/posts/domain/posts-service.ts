import {
    PostDBMongoType,
} from "../../../input-output-types/inputOutputTypesMongo";
import {blogsMongoRepository} from "../../blogs/repositories/blogsMongoRepository";
import {postCollection} from "../../../db/mongo/mongo-db";
import {ObjectId, WithId} from "mongodb";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {PaginatorPostType, TypePostViewModel} from "../../../input-output-types/posts/outputTypes";
import {postsMongoRepository} from "../repositories/postMongoRepository";
import {blogsMongooseRepository} from "../../blogs/repositories/blogsMongooseRepository";
import {blogQueryRepository} from "../../blogs/repositories/blogQueryRepository";
import {PostModel} from "../../../db/mongo/post/post.model";
import {postsMongooseRepository} from "../repositories/postsMongooseRepository";
import {ResultStatus} from "../../../common/types/resultCode";
import {ResultObject} from "../../../common/types/result.types";
import {PaginatorBlogType, TypeBlogViewModel} from "../../blogs/types/outputTypes";
import {postQueryRepository} from "../repositories/postQueryRepository";
import {HelperQueryTypeBlog, HelperQueryTypePost} from "../../../input-output-types/inputTypes";

export const postsService = {
    async create(dto: TypePostInputModelModel): Promise<ResultObject<TypePostViewModel | null>> {

        //OLD
        // const foundedBlog = await blogsMongoRepository.findForOutput(new ObjectId(input.blogId));
        // const newPost: PostDBMongoType = {
        //     title: input.title,
        //     shortDescription: input.shortDescription,
        //     content: input.content,
        //     blogId: input.blogId,
        //     blogName: foundedBlog?.name,
        //     createdAt: new Date().toISOString(),
        // }
        // return postsMongoRepository.create(newPost);

        const foundedBlog = await blogQueryRepository.findForOutput(new ObjectId(dto.blogId));

        const newPost = new PostModel(dto);
        newPost.createdAt = new Date().toISOString();
        newPost.blogName = foundedBlog!.name;

        const createdPostID = await postsMongooseRepository.save(newPost);

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

       return  postsMongooseRepository.findById(id);

    },
    async deletePost(id: string) : Promise<ResultObject<null>> {

        // await postsMongoRepository.deletePost(id);
        if (!ObjectId.isValid(id)) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const foundPost = await postQueryRepository.findForOutput(new ObjectId(id));

        if(!foundPost) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const resultOfDelete =  await postsMongooseRepository.deletePost(new ObjectId(id));

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
    async updatePost(id: string, dto: TypePostInputModelModel) : Promise<ResultObject<TypePostViewModel | null>> {

        // let post = await postsMongoRepository.findForOutput(id);
        // if (!post) {
        //     return undefined;
        // } else {
        //     await postsMongoRepository.updatePost(id, input)
        // }

        if (!ObjectId.isValid(id)) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }
        const foundedPost = await postsMongooseRepository.findById(new ObjectId(id));

        if(!foundedPost){
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        await postsMongooseRepository.updatePost(foundedPost, dto);

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