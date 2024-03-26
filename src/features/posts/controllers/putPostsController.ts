import { Request, Response} from "express";
import {ObjectId} from "mongodb";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {ParamsType} from "../../../input-output-types/inputTypes";
import {TypePostViewModel} from "../../../input-output-types/posts/outputTypes";
import {postsService} from "../domain/posts-service";

export const putPostsController = async (req: Request<ParamsType, TypePostInputModelModel, any, any>, res: Response<TypePostViewModel>) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404);
    }
    const foundedPost = await postsService.find(new ObjectId(req.params.id))
    if (!foundedPost) {
        res.sendStatus(404);
        return;
    }
    await postsService.updatePost(new ObjectId(req.params.id), req.body);
    const foundPost = await postsService.findForOutput(new ObjectId(req.params.id));
    res
        .status(204)
        .send(foundPost);
}