import { Request, Response} from "express";
import {ObjectId} from "mongodb";
import {ParamsType} from "../../../input-output-types/inputTypes";
import {CommentInputModelType} from "../../../input-output-types/comments/inputTypes";
import {CommentViewModelType} from "../../../input-output-types/comments/outputTypes";
import {feedbacksService} from "../domain/feedbacks-service";
import {commentQueryRepository} from "../reepositories/commentQueryRepository";

export const putCommentsController = async (req: Request<ParamsType, CommentInputModelType, any, any>, res: Response<CommentViewModelType>) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404);
    }

    const foundedComment = await commentQueryRepository.find(new ObjectId(req.params.id))
    if (!foundedComment) {
        res.sendStatus(404);
        return;
    }
    if(foundedComment.commentatorInfo.userId!==req.userId){
        res.sendStatus(403);
        return;
    }
    await feedbacksService.updateComment(new ObjectId(req.params.id), req.body);
    // const editedComment = await commentQueryRepository.findForOutput(new ObjectId(req.params.id));

    res
        .sendStatus(204)
}