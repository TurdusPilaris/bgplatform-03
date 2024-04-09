import {Request, Response} from "express";
import {ParamsType} from "../../../input-output-types/inputTypes";
import {CommentInputModelType} from "../../../input-output-types/comments/inputTypes";
import {CommentViewModelType} from "../../../input-output-types/comments/outputTypes";
import {feedbacksService} from "../domain/feedbacks-service";
import {ResultStatus} from "../../../common/types/resultCode";

export const putCommentsController = async (req: Request<ParamsType, CommentInputModelType, any, any>, res: Response<CommentViewModelType>) => {

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