import {ObjectId, WithId} from "mongodb";
import {BlogDBMongoType, PostDBMongoType,} from "../../../input-output-types/inputOutputTypesMongo";
import {TypeBlogInputModel} from "../types/inputTypes";
import {PaginatorBlogType, TypeBlogViewModel} from "../types/outputTypes";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {ResultObject} from "../../../common/types/result.types";
import {ResultStatus} from "../../../common/types/resultCode";
import {HelperQueryTypeBlog} from "../../../input-output-types/inputTypes";
import {BlogModel} from "../../../db/mongo/blog/blog.model";
import {BlogsRepository} from "../repositories/blogsRepository";
import {PostModel} from "../../../db/mongo/post/post.model";
import {TypePostViewModel} from "../../../input-output-types/posts/outputTypes";
import {PostsQueryRepository} from "../../posts/repositories/postsQueryRepository";
import {BlogsQueryRepository} from "../repositories/blogQueryRepository";
import {PostsRepository} from "../../posts/repositories/postsRepository";

export class BlogsService{
    constructor(protected blogsRepository: BlogsRepository,
                protected blogsQueryRepository: BlogsQueryRepository,
                protected postsRepository: PostsRepository,
                protected postsQueryRepository: PostsQueryRepository) {}
    async create(dto: TypeBlogInputModel): Promise<ResultObject<TypeBlogViewModel | null>> {

        const newBlog = new BlogModel(dto);
        newBlog.createdAt = new Date().toISOString();
        newBlog.isMembership = false;

        const createdBlogId = await this.blogsRepository.save(newBlog);

        if (!createdBlogId) {
            return {
                status: ResultStatus.InternalServerError,
                data: null
            }
        }
        const createdBlog = await this.blogsQueryRepository.findForOutput(new ObjectId(createdBlogId));

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

    }

    async createPostForBlog(dto: TypePostInputModelModel, blogId: string): Promise<ResultObject<TypePostViewModel | null>> {

        if (!ObjectId.isValid(blogId)) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'Blog ID is not valid',
                errorField: 'blogId'
            }
        }

        const foundedBlog = await this.blogsRepository.findById(new ObjectId(blogId));

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

        await this.postsRepository.save(newPost);

        const updatedPost = await this.postsQueryRepository.findForOutput(newPost._id)

        return {
            status: ResultStatus.Success,
            data: updatedPost
        }

    }

    async deleteBlog(id: string): Promise<ResultObject<null>> {

        if (!ObjectId.isValid(id)) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const foundBlog = await this.blogsQueryRepository.findForOutput(new ObjectId(id))
        if (!foundBlog) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const resultOfDelete = await this.blogsRepository.deleteBlog(new ObjectId(id));

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
    async find(id: ObjectId): Promise<BlogDBMongoType | null> {

        return this.blogsRepository.findById(id)

    }
    async findForOutput(id: ObjectId) {

        return this.blogsQueryRepository.findForOutput(id);

    }
    mapToOutput(blog: WithId<BlogDBMongoType>): TypeBlogViewModel {

        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: false
        }

    }
    async updateBlog(id: string, input: TypeBlogInputModel): Promise<ResultObject<TypeBlogViewModel | null>> {

        if (!ObjectId.isValid(id)) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        const foundedBlog = await this.blogsRepository.findById(new ObjectId(id));
        if (!foundedBlog) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        await this.blogsRepository.updateBlog(foundedBlog, input);

        const foundBlog = await this.blogsQueryRepository.findForOutput(foundedBlog._id);

        return {
            status: ResultStatus.Success,
            data: foundBlog
        }

    }
    async getAllBlogs(query: HelperQueryTypeBlog): Promise<ResultObject<PaginatorBlogType>> {

        const allBlogWithPaginator = await this.blogsQueryRepository.getAllBlogs(query)

        return {
            status: ResultStatus.Success,
            data: allBlogWithPaginator
        }
    }
}
