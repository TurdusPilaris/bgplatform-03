import {
    PostDBMongoType, PostDBMongoTypeWithoutID,
} from "../../../input-output-types/inputOutputTypesMongo";
import {blogsMongoRepository} from "../../blogs/repositories/blogsMongoRepository";
import {postCollection} from "../../../db/mongo/mongo-db";
import {ObjectId} from "mongodb";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {TypePostViewModel} from "../../../input-output-types/posts/outputTypes";
import {postsMongoRepository} from "../repositories/postMongoRepository";

export const postsService = {
    async create(input: TypePostInputModelModel) {

        const foundedBlog = await blogsMongoRepository.findForOutput(new ObjectId(input.blogId));
        const newPost: PostDBMongoTypeWithoutID = {
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: input.blogId,
            blogName: foundedBlog?.name,
            createdAt: new Date().toISOString(),
        }
        return postsMongoRepository.create(newPost);

    },
    async find(id: ObjectId) {

        return (await postCollection.findOne({_id: id})) as PostDBMongoType;

    },
    async findForOutput(id: ObjectId) {
        const foundPost = await this.find(id);
        if (!foundPost) {
            return undefined
        }
        return this.mapToOutput(foundPost);
    },
    mapToOutput(post: PostDBMongoType): TypePostViewModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription || '',
            content: post.content || '',
            blogId: post.blogId || '',
            blogName: post.blogName || '',
            createdAt: post.createdAt || '',

        }
    },

    async deletePost(id: ObjectId) {

        await postsMongoRepository.deletePost(id);

    },
    async updatePost(id: ObjectId, input: TypePostInputModelModel) {

        let post = await postsMongoRepository.findForOutput(id);
        if (!post) {
            return undefined;
        } else {
            await postsMongoRepository.updatePost(id, input)
        }
    }

}