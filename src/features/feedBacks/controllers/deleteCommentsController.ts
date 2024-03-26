import { Request, Response} from "express";
import {ObjectId} from "mongodb";
import {ParamsType} from "../../../input-output-types/inputTypes";
import {feedbacksService} from "../domain/feedbacks-service";
import {commentQueryRepository} from "../reepositories/commentQueryRepository";
export const deleteCommentsController = async (req: Request<ParamsType, any, any, any >, res: Response<any>) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404);
    }
    const foundComment = await commentQueryRepository.find(new ObjectId(req.params.id))
    if (!foundComment) {
        res.sendStatus(404);
        return;
    }
    if(foundComment.commentatorInfo.userId!==req.userId){
        res.sendStatus(403);
        return;
    }
    await feedbacksService.deleteComment(new ObjectId(req.params.id));

    res.sendStatus(204);
    return;


}