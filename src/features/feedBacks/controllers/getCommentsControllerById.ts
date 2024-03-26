import { Request, Response} from "express";
import {commentQueryRepository} from "../reepositories/commentQueryRepository";
import {ObjectId} from "mongodb";

export const getCommentsControllerById = async (req: Request<any, any, any, any>, res: Response) => {

    const foundComment = await commentQueryRepository.findForOutput(new ObjectId(req.params.id));
    if(!foundComment) {
        res.sendStatus(404)
    }
    res
        .status(200)
        .send(foundComment);

}