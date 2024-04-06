import {blogsMongoRepository} from "../repositories/blogsMongoRepository";
import {ObjectId, WithId} from "mongodb";
import {BlogDBMongoType, PostDBMongoType,} from "../../../input-output-types/inputOutputTypesMongo";
import {TypeBlogInputModel} from "../types/inputTypes";
import {PaginatorBlogType, TypeBlogViewModel} from "../types/outputTypes";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {postsMongoRepository} from "../../posts/repositories/postMongoRepository";
import {ResultObject} from "../../../common/types/result.types";
import {ResultStatus} from "../../../common/types/resultCode";
import {HelperQueryTypeBlog} from "../../../input-output-types/inputTypes";
import {blogQueryRepository} from "../repositories/blogQueryRepository";
import {BlogModel} from "../../../db/mongo/blog/blog.model";
import {blogsMongooseRepository} from "../repositories/blogsMongooseRepository";
import {postsMongooseRepository} from "../../posts/repositories/postsMongooseRepository";

export const blogsService = {

    async create(dto: TypeBlogInputModel): Promise<ResultObject<TypeBlogViewModel | null>> {

        const newBlog = new BlogModel(dto);
        newBlog.createdAt = new Date().toISOString();
        newBlog.isMembership = false;

        const createdBlogId = await blogsMongooseRepository.save(newBlog);

        if (!createdBlogId) {
            return {
                status: ResultStatus.InternalServerError,
                data: null
            }
        }
        const createdBlog = await blogQueryRepository.findForOutput(new ObjectId(createdBlogId));

        if (!createdBlog) {
            return {
                status: ResultStatus.InternalServerError,
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            data: createdBlog
        }
        // const newBlog = {
        //     name: input.name,
        //     description: input.description,
        //     websiteUrl: input.websiteUrl,
        //     createdAt: new Date().toISOString(),
        //     isMembership: false
        //
        // }
        //
        // return blogsMongoRepository.create(newBlog);

    },

    async createPostForBlog(input: TypePostInputModelModel, blogId: string) {

        const foundedBlog = await blogsMongoRepository.findForOutput(new ObjectId(blogId));
        const newPost: PostDBMongoType = {
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: foundedBlog?.id,
            blogName: foundedBlog?.name,
            createdAt: new Date().toISOString(),
        }
        return postsMongoRepository.create(newPost);
        // return postsMongooseRepository.create(newPost)

    },

    async deleteBlog(id: string): Promise<ResultObject<null>> {

        if (!ObjectId.isValid(id)) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const foundBlog = await blogQueryRepository.findForOutput(new ObjectId(id))
        if (!foundBlog) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }
        // await blogsMongoRepository.delete(id);
        const resultOfDelete = await blogsMongooseRepository.deleteBlog(new ObjectId(id));

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
    async find(id: ObjectId): Promise<BlogDBMongoType | null> {
        // return blogCollection.findOne({_id: id});
        return blogsMongooseRepository.findById(id)
    },
    findForOutput: async function (id: ObjectId) {

        // return blogsMongoRepository.findForOutput(id);
        return blogQueryRepository.findForOutput(id);

    },
    mapToOutput(blog: WithId<BlogDBMongoType>): TypeBlogViewModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: false
        }
    },
    async updateBlog(id: string, input: TypeBlogInputModel): Promise<ResultObject<TypeBlogViewModel | null>> {

        if (!ObjectId.isValid(id)) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        //OLD
        // const foundedBlog = await this.find(new ObjectId(id))
        // if (!foundedBlog) {
        //     return {
        //         status: ResultStatus.NotFound,
        //         data: null
        //     }
        // }

        //NEW with mongoose
        const foundedBlog = await blogsMongooseRepository.findById(new ObjectId(id));
        if (!foundedBlog) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        await blogsMongooseRepository.updateBlog(foundedBlog, input);

        const foundBlog = await blogQueryRepository.findForOutput(foundedBlog._id);

        return {
            status: ResultStatus.Success,
            data: foundBlog
        }


    },
    async getAllBlogs(query: HelperQueryTypeBlog): Promise<ResultObject<PaginatorBlogType>> {

        const allBlogWithPaginator = await blogQueryRepository.getAllBlogs(query)

        return {
            status: ResultStatus.Success,
            data: allBlogWithPaginator
        }
    },
}