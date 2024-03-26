import { Request, Response} from "express";
import {ObjectId} from "mongodb";
import {postQueryRepository} from "../repositories/postQueryRepository";

export const getPostsControllerByID = async (req: Request<any, any, any, any>, res: Response) => {

    const foundPost = await postQueryRepository.findForOutput(new ObjectId(req.params.id));
    if(!foundPost) {
        res.sendStatus(404)
    }
    res
        .status(200)
        .send(foundPost);

}