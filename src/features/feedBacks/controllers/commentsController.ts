import {Request, Response} from "express";
import {ParamsType} from "../../../input-output-types/inputTypes";
import {CommentInputModelType} from "../../../input-output-types/feedBacks/inputTypes";
import {CommentViewModelType} from "../../../input-output-types/feedBacks/outputTypes";
import {FeedbacksService} from "../domain/feedbacks-service";
import {ResultStatus} from "../../../common/types/resultCode";
import {ObjectId} from "mongodb";
import {FeedBacksQueryRepository} from "../reepositories/feedBackQueryRepository";
import {body} from "express-validator";
import {injectable} from "inversify";
@injectable()
export class CommentsController {
    constructor(
        protected feedbacksService: FeedbacksService,
        protected feedBacksQueryRepository: FeedBacksQueryRepository,
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
}