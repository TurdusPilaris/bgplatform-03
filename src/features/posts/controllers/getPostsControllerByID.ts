import { Request, Response} from "express";
import {ObjectId} from "mongodb";
import {postQueryRepository} from "../repositories/postQueryRepository";

export const getPostsControllerByID = async (req: Request<any, any, any, any>, res: Response) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return;
    }

    const foundPost = await postQueryRepository.findForOutput(new ObjectId(req.params.id));
    if(!foundPost) {
        res.sendStatus(404)
        return
    }
    res
        .status(200)
        .send(foundPost);

}