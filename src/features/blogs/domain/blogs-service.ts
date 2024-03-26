import {blogsMongoRepository} from "../repositories/blogsMongoRepository";
import {ObjectId} from "mongodb";
import {BlogDBMongoType, PostDBMongoTypeWithoutID,} from "../../../input-output-types/inputOutputTypesMongo";
import {blogCollection} from "../../../db/mongo-db";
import {TypeBlogInputModel} from "../../../input-output-types/blogs/inputTypes";
import {PaginatorBlogType, TypeBlogViewModel} from "../../../input-output-types/blogs/outputTypes";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {postsMongoRepository} from "../../posts/repositories/postMongoRepository";
import {ResultObject} from "../../../common/types/result.types";
import {ResultStatus} from "../../../common/types/resultCode";
import {HelperQueryTypeBlog} from "../../../input-output-types/inputTypes";
import {blogQueryRepository} from "../repositories/blogQueryRepository";

export const blogsService = {

    async create(input: TypeBlogInputModel) {

        const newBlog = {
            name: input.name,
            description: input.description,
            websiteUrl: input.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false

        }

        return blogsMongoRepository.create(newBlog);

    },

    async createPostForBlog(input: TypePostInputModelModel, blogId:string) {

        const foundedBlog = await blogsMongoRepository.findForOutput(new ObjectId(blogId));
        const newPost: PostDBMongoTypeWithoutID = {
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: foundedBlog?.id,
            blogName: foundedBlog?.name,
            createdAt: new Date().toISOString(),
        }
        return postsMongoRepository.create(newPost);

    },

    async deleteBlog(id: ObjectId) {

        await blogsMongoRepository.delete(id);

    },
    async find(id: ObjectId): Promise<BlogDBMongoType|null> {
        return blogCollection.findOne({_id: id});
    },
    findForOutput: async function (id: ObjectId) {

        return blogsMongoRepository.findForOutput(id);

    },
    mapToOutput(blog: BlogDBMongoType): TypeBlogViewModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: false
        }
    },
    async updateBlog(id: string, input: TypeBlogInputModel):Promise<ResultObject<TypeBlogViewModel|null>> {

        if (!ObjectId.isValid(id)) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const foundedBlog = await this.find(new ObjectId(id))
        if (!foundedBlog) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        await blogsMongoRepository.updateBlog(new ObjectId(id), input);

        const foundBlog = await this.findForOutput(new ObjectId(id))

        return {
            status: ResultStatus.Success,
            data: foundBlog
        }


    },
    async getAllBlogs(query:HelperQueryTypeBlog): Promise<ResultObject<PaginatorBlogType>> {

        const allBlogWithPaginator = await blogQueryRepository.getAllBlogs(query)

        return {
            status: ResultStatus.Success,
            data: allBlogWithPaginator
        }
    },
}