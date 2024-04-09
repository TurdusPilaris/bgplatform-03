import {ResultStatus} from "../../../common/types/resultCode";
import { Request, Response} from "express";
import {ParamsType} from "../../../input-output-types/inputTypes";
import {feedbacksService} from "../domain/feedbacks-service";

export const deleteCommentsController = async (req: Request<ParamsType, any, any, any >, res: Response<any>) => {

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