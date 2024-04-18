import {Request, Response} from "express";
import {TypeBlogInputModel} from "../../blogs/types/inputTypes";
import {PostsService} from "../domain/posts-service";
import {ResultStatus} from "../../../common/types/resultCode";
import {HelperQueryTypeComment, HelperQueryTypePost, ParamsType} from "../../../input-output-types/inputTypes";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {PaginatorPostType, TypePostViewModel} from "../../../input-output-types/posts/outputTypes";
import {ObjectId, SortDirection} from "mongodb";
import {PaginatorCommentsType} from "../../../input-output-types/feedBacks/outputTypes";
import {FeedBacksQueryRepository} from "../../feedBacks/reepositories/feedBackQueryRepository";
import {FeedbacksService} from "../../feedBacks/domain/feedbacks-service";
import {PostsQueryRepository} from "../repositories/postsQueryRepository";
import {injectable} from "inversify";
@injectable()
export class PostsController {
    constructor(protected postsService: PostsService,
                protected feedbackService: FeedbacksService,
                protected feedBacksQueryRepository: FeedBacksQueryRepository,
                protected postsQueryRepository: PostsQueryRepository) {}
    async postForPostsController(req: Request<TypeBlogInputModel>, res: Response) {

        //NEW
        const resultObject = await this.postsService.create(req.body);

        if(resultObject.status === ResultStatus.InternalServerError){
            res.sendStatus(500);
            return;
        }

        if(resultObject.status === ResultStatus.Success){
            res
                .status(201)
                .send(resultObject.data);
        }
    }
    async putPostsController(req: Request<ParamsType, TypePostInputModelModel, any, any>, res: Response<TypePostViewModel>) {

        const resultObject = await  this.postsService.updatePost(req.params.id, req.body);

        if (!resultObject.data) {
            if (resultObject.status === ResultStatus.NotFound) {
                res.sendStatus(404)
                return;
            }
        } else if(resultObject.status === ResultStatus.Success){
            res.status(204).send(resultObject.data);
            return;
        }
    }
    async getPostsControllerByID(req: Request<any, any, any, any>, res: Response)  {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(404)
            return;
        }

        const foundPost = await this.postsQueryRepository.findForOutput(new ObjectId(req.params.id));
        if(!foundPost) {
            res.sendStatus(404)
            return
        }
        res
            .status(200)
            .send(foundPost);

    }
    async getPostsController (req: Request<any, any, any, any>, res: Response<PaginatorPostType>){

        const helper = (query:any) => {
            const queryHelper: HelperQueryTypePost = {
                pageNumber: query.pageNumber ? +query.pageNumber : 1,
                pageSize: query.pageSize ? +query.pageSize : 10,
                sortBy: query.sortBy ? query.sortBy : 'createdAt',
                sortDirection: query.sortDirection ? query.sortDirection : 'desc',

            }
            return queryHelper;
        }

        const result = await this.postsService.getAllPosts(helper(req.query))

        res
            .status(200)
            .send(result.data);

    }
    async deletePostsController(req: Request<ParamsType>, res: Response) {

        const resultObject = await this.postsService.deletePost(req.params.id);

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
    async getCommentForPost(req: Request<any, any, any, any>, res: Response<PaginatorCommentsType>){

        const helper = (query: any):HelperQueryTypeComment => {
            return {
                pageNumber: query.pageNumber ? +query.pageNumber : 1,
                pageSize: query.pageSize ? +query.pageSize : 10,
                sortBy: query.sortBy ? query.sortBy : 'createdAt',
                sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
            }

        }

        const post = await this.postsQueryRepository.findForOutput(new ObjectId(req.params.postId))
        if (!post) {
            res.sendStatus(404)
            return
        }

        const answer = await this.feedBacksQueryRepository.getMany(helper(req.query), req.params.postId, req.userId);
        res
            .status(200)
            .send(answer);
    }
    async postCommentsForPostController(req: Request, res: Response) {

        const resultObject = await this.feedbackService.createComment(req.body.content, req.params.postId, req.userId!);

        if(resultObject.status === ResultStatus.NotFound){
            res.sendStatus(404);
            return;
        }
        if(resultObject.status === ResultStatus.InternalServerError){
            res.sendStatus(500);
            return;
        }

        if(resultObject.status === ResultStatus.Success){
            res
                .status(201)
                .send(resultObject.data);
        }

    }

    async putLikeStatusForPost(req: Request, res: Response){

        const resultObject =  await this.postsService.updateLikeStatus(req.params.id, req.userId, req.body.likeStatus);

        if(resultObject.status === ResultStatus.NotFound){
            res.sendStatus(404)
            return
        }
        if(resultObject.status === ResultStatus.Unauthorized){
            res.sendStatus(401)
            return
        }
        if(resultObject.status === ResultStatus.BadRequest){
            res.status(400)
                .send({ errorsMessages: [{ message: resultObject.errorMessage, field: resultObject.errorField }] });
            return
        }
        if(resultObject.status === ResultStatus.Success){
            res.sendStatus(204)
            return
        }
    }
}