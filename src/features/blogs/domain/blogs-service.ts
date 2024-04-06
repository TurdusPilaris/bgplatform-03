import {blogsMongoRepository} from "../repositories/blogsMongoRepository";
import {ObjectId, WithId} from "mongodb";
import {BlogDBMongoType, PostDBMongoTypeWithoutID,} from "../../../input-output-types/inputOutputTypesMongo";
import {blogCollection} from "../../../db/mongo/mongo-db";
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

export const blogsService = {

    async create(dto: TypeBlogInputModel) {

        const newBlog = new BlogModel(dto);
        // newBlog.name = dto.name;
        // newBlog.description = dto.description;
        // newBlog.websiteUrl = dto.websiteUrl;
        newBlog.createdAt = new Date().toISOString();
        newBlog.isMembership = false;

        return blogsMongooseRepository.save(newBlog);
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

        // return blogsMongoRepository.findForOutput(id);
        return blogsMongooseRepository.findForOutput(id);

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
    async updateBlog(id: string, input: TypeBlogInputModel):Promise<ResultObject<TypeBlogViewModel|null>> {

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

        const foundBlog = await blogsMongooseRepository.findForOutput(new ObjectId(id));

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