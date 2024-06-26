import {Request, Response} from "express";
import {HelperQueryTypeBlog, HelperQueryTypePost, ParamsType} from "../../../input-output-types/inputTypes";
import {TypeBlogInputModel} from "../types/inputTypes";
import {TypeBlogViewModel} from "../types/outputTypes";
import {BlogsService} from "../domain/blogs-service";
import {ResultStatus} from "../../../common/types/resultCode";
import {ObjectId, SortDirection} from "mongodb";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {PaginatorPostType} from "../../../input-output-types/posts/outputTypes";
import {BlogsQueryRepository} from "../repositories/blogQueryRepository";
import {injectable} from "inversify";
import {PostsQueryRepository} from "../../posts/repositories/postsQueryRepository";

@injectable()
export class BlogsController {
    constructor(protected blogsService: BlogsService,
                protected blogsQueryRepository: BlogsQueryRepository,
                protected postsQueryRepository: PostsQueryRepository) {
    }

    async postBlogsController(req: Request<ParamsType, TypeBlogInputModel>, res: Response<TypeBlogViewModel | null>) {

        //NEW
        const resultObject = await this.blogsService.create(req.body);

        if (resultObject.status === ResultStatus.InternalServerError) {
            res.sendStatus(500);
            return;
        }

        if (resultObject.status === ResultStatus.Success) {
            res
                .status(201)
                .send(resultObject.data);
        }

    }

    async putBlogsController(req: Request<ParamsType, TypeBlogInputModel>, res: Response<TypeBlogViewModel>) {

        const resultObject = await this.blogsService.updateBlog(req.params.id, req.body);

        if (!resultObject.data) {
            if (resultObject.status === ResultStatus.NotFound) {
                res.sendStatus(404)
                return;
            }
        } else if (resultObject.status === ResultStatus.Success) {
            res.status(204).send(resultObject.data);
            return;
        }

    }

    async deleteBlogsController(req: Request<ParamsType>, res: Response) {

        const resultObject = await this.blogsService.deleteBlog(req.params.id);

        if (resultObject.status === ResultStatus.NotFound) {
            res.sendStatus(404);
            return
        }
        if (resultObject.status === ResultStatus.InternalServerError) {
            res.sendStatus(500);
            return
        }
        if (resultObject.status === ResultStatus.Success) {
            res.sendStatus(204);
        }
    }

    async getBlogsControllerByID(req: Request<any, any, any, any>, res: Response<TypeBlogViewModel>) {

        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(404)
            return;
        }
        const foundBlog = await this.blogsQueryRepository.findForOutput(new ObjectId(req.params.id));
        if (!foundBlog) {
            res.sendStatus(404)
            return;
        }
        res
            .status(200)
            .send(foundBlog);
    }

    async getBlogsController(req: Request, res: Response) {
        const helper = (query: any) => {

            const queryHelper: HelperQueryTypeBlog = {
                searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
                pageNumber: query.pageNumber ? +query.pageNumber : 1,
                pageSize: query.pageSize ? +query.pageSize : 10,
                sortBy: query.sortBy ? query.sortBy : 'createdAt',
                sortDirection: query.sortDirection ? query.sortDirection : 'desc',

            }
            return queryHelper;
        }

        const result = await this.blogsService.getAllBlogs(helper(req.query));

        res

            .status(200)
            .send(result.data);

    }

    async postPostsForBlogsController(req: Request<{
        blogId: string
    }, TypePostInputModelModel, any, any>, res: Response) {

        const resultObject = await this.blogsService.createPostForBlog(req.body, req.params.blogId, req.userId);

        if (resultObject.status === ResultStatus.NotFound) {
            res
                .status(404)
                .send({errorsMessages: [{message: resultObject.errorMessage, field: resultObject.errorField}]})
            return
        }
        if (resultObject.status === ResultStatus.Success) {
            res
                .status(201)
                .send(resultObject.data!);
        }
    }

    async getPostsForBlogID(req: Request<any, any, any, any>, res: Response<PaginatorPostType>) {

        const helper = (query: any): HelperQueryTypePost => {
            return {
                pageNumber: query.pageNumber ? +query.pageNumber : 1,
                pageSize: query.pageSize ? +query.pageSize : 10,
                sortBy: query.sortBy ? query.sortBy : 'createdAt',
                sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
            }

        }

        const answer = await this.postsQueryRepository.getAllPosts(helper(req.query), req.userId, req.params.blogId);
        res
            .status(200)
            .send(answer);
    }
}