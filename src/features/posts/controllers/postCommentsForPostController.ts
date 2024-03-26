import { Request, Response} from "express";
import {
    InsertedInfoType
} from "../../../input-output-types/inputOutputTypesMongo";
import {feedbacksService} from "../../feedBacks/domain/feedbacks-service";
import {commentQueryRepository} from "../../feedBacks/reepositories/commentQueryRepository";
import {postQueryRepository} from "../repositories/postQueryRepository";
import {ObjectId} from "mongodb";
export const postCommentsForPostController = async (req: Request, res: Response) => {

    const post = await postQueryRepository.findForOutput(new ObjectId(req.params.postId))
    if (!post) {
        res.sendStatus(404)
        return
    }
    const insertedInfo: InsertedInfoType |undefined = await feedbacksService.createComment(req.body.content, req.params.postId, req.userId!);

    if(insertedInfo){

        const newComment = await  commentQueryRepository.findForOutput(insertedInfo.insertedId);
        res
            .status(201)
            .send(newComment);
    }


}