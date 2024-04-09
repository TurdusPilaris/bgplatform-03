import { Request, Response} from "express";
import {feedbacksService} from "../../feedBacks/domain/feedbacks-service";
import {ResultStatus} from "../../../common/types/resultCode";
export const postCommentsForPostController = async (req: Request, res: Response) => {

    const resultObject = await feedbacksService.createComment(req.body.content, req.params.postId, req.userId!);

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