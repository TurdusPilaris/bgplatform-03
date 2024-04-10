import {Request, Response} from "express";
import {ParamsType} from "../../../input-output-types/inputTypes";
import {CommentInputModelType} from "../../../input-output-types/comments/inputTypes";
import {CommentViewModelType} from "../../../input-output-types/comments/outputTypes";
import {feedbacksService} from "../domain/feedbacks-service";
import {ResultStatus} from "../../../common/types/resultCode";
import {commentQueryRepository} from "../reepositories/commentQueryRepository";
import {ObjectId} from "mongodb";

export class CommentsController {
    async putCommentsController(req: Request<ParamsType, CommentInputModelType, any, any>, res: Response<CommentViewModelType>) {

        const resultObject = await feedbacksService.updateComment(req.params.id, req.body, req.userId!)

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

        const foundComment = await commentQueryRepository.findForOutput(new ObjectId(req.params.id));
        if(!foundComment) {
            res.sendStatus(404)
        }
        res
            .status(200)
            .send(foundComment);

    }

    async deleteCommentsController (req: Request<ParamsType, any, any, any >, res: Response<any>) {

        const resultObject = await feedbacksService.deleteComment(req.params.id, req.userId!);

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
}