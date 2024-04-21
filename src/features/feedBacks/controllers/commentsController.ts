import {Request, Response} from "express";
import {HelperQueryTypeComment, ParamsType} from "../../../input-output-types/inputTypes";
import {CommentInputModelType} from "../../../input-output-types/feedBacks/inputTypes";
import {CommentViewModelType, PaginatorCommentsType} from "../../../input-output-types/feedBacks/outputTypes";
import {FeedbacksService} from "../domain/feedbacks-service";
import {ResultStatus} from "../../../common/types/resultCode";
import {ObjectId, SortDirection} from "mongodb";
import {FeedBacksQueryRepository} from "../reepositories/feedBackQueryRepository";
import {body} from "express-validator";
import {injectable} from "inversify";
import {PostsRepository} from "../../posts/repositories/postsRepository";
@injectable()
export class CommentsController {
    constructor(
        protected feedbacksService: FeedbacksService,
        protected feedBacksQueryRepository: FeedBacksQueryRepository,
        protected postsRepository: PostsRepository
    ) {}

    async putCommentsController(req: Request<ParamsType, CommentInputModelType, any, any>, res: Response<CommentViewModelType>) {

        const resultObject = await this.feedbacksService.updateComment(req.params.id, req.body, req.userId!)

        if (resultObject.status === ResultStatus.NotFound) {
            res.sendStatus(404);
            return
        }
        if (resultObject.status === ResultStatus.Forbidden) {
            res.sendStatus(403);
            return
        }

        if (resultObject.status === ResultStatus.Success) {
            res.sendStatus(204)
        }
    }

    async getCommentsControllerById(req: Request<any, any, any, any>, res: Response) {

        const foundComment = await this.feedBacksQueryRepository.findCommentWithLikesForOutput(new ObjectId(req.params.id), req.userId);
        if(!foundComment) {
            res.sendStatus(404)
        }
        res
            .status(200)
            .send(foundComment);

    }

    async deleteCommentsController (req: Request<ParamsType, any, any, any >, res: Response<any>) {

        const resultObject = await this.feedbacksService.deleteComment(req.params.id, req.userId!);

        if (resultObject.status === ResultStatus.NotFound) {
            res.sendStatus(404);
            return
        }
        if (resultObject.status === ResultStatus.Forbidden) {
            res.sendStatus(403);
            return
        }

        if (resultObject.status === ResultStatus.Success) {
            res.sendStatus(204)
        }

    }

    async putLikeStatusForComment(req: Request, res: Response){

        const resultObject =  await this.feedbacksService.updateLikeStatus(req.params.id, req.userId, req.body.likeStatus);

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
    async postCommentsForPostController(req: Request, res: Response) {

        const resultObject = await this.feedbacksService.createComment(req.body.content, req.params.postId, req.userId!);

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
    async getCommentForPost(req: Request<any, any, any, any>, res: Response<PaginatorCommentsType>){

        const helper = (query: any):HelperQueryTypeComment => {
            return {
                pageNumber: query.pageNumber ? +query.pageNumber : 1,
                pageSize: query.pageSize ? +query.pageSize : 10,
                sortBy: query.sortBy ? query.sortBy : 'createdAt',
                sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
            }

        }

        const post = await this.postsRepository.findById(new ObjectId(req.params.postId))
        if (!post) {
            res.sendStatus(404)
            return
        }

        const answer = await this.feedBacksQueryRepository.getMany(helper(req.query), req.params.postId, req.userId);
        res
            .status(200)
            .send(answer);
    }
}