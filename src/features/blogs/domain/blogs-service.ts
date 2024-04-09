import {ObjectId, WithId} from "mongodb";
import {BlogDBMongoType, PostDBMongoType,} from "../../../input-output-types/inputOutputTypesMongo";
import {TypeBlogInputModel} from "../types/inputTypes";
import {PaginatorBlogType, TypeBlogViewModel} from "../types/outputTypes";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {ResultObject} from "../../../common/types/result.types";
import {ResultStatus} from "../../../common/types/resultCode";
import {HelperQueryTypeBlog} from "../../../input-output-types/inputTypes";
import {blogQueryRepository} from "../repositories/blogQueryRepository";
import {BlogModel} from "../../../db/mongo/blog/blog.model";
import {blogsRepository} from "../repositories/blogsRepository";
import {postsRepository} from "../../posts/repositories/postsRepository";
import {PostModel} from "../../../db/mongo/post/post.model";
import {TypePostViewModel} from "../../../input-output-types/posts/outputTypes";
import {postQueryRepository} from "../../posts/repositories/postQueryRepository";

export const blogsService = {

    async create(dto: TypeBlogInputModel): Promise<ResultObject<TypeBlogViewModel | null>> {

        const newBlog = new BlogModel(dto);
        newBlog.createdAt = new Date().toISOString();
        newBlog.isMembership = false;

        const createdBlogId = await blogsRepository.save(newBlog);

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

    },

    async createPostForBlog(dto: TypePostInputModelModel, blogId: string): Promise<ResultObject<TypePostViewModel | null>> {

        if (!ObjectId.isValid(blogId)) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'Blog ID is not valid',
                errorField: 'blogId'
            }
        }

        const foundedBlog = await blogsRepository.findById(new ObjectId(blogId));

        if (!foundedBlog) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'Blog not found',
                errorField: 'blogId'
            }
        }

        const newPost = new PostModel(dto);
        newPost.createdAt = new Date().toISOString();
        newPost.blogId = blogId;
        newPost.blogName = foundedBlog!.name;

        await postsRepository.save(newPost);

        const updatedPost = await postQueryRepository.findForOutput(newPost._id)

        return {
            status: ResultStatus.Success,
            data: updatedPost
        }

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

        const resultOfDelete = await blogsRepository.deleteBlog(new ObjectId(id));

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

        return blogsRepository.findById(id)

    },
    findForOutput: async function (id: ObjectId) {

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

        const foundedBlog = await blogsRepository.findById(new ObjectId(id));
        if (!foundedBlog) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        await blogsRepository.updateBlog(foundedBlog, input);

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