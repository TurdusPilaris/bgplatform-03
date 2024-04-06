import { Request, Response} from "express";
import {ObjectId} from "mongodb";
import {ParamsType} from "../../../input-output-types/inputTypes";
import {postsService} from "../domain/posts-service";
import {ResultStatus} from "../../../common/types/resultCode";
export const deletePostsController = async (req: Request<ParamsType>, res: Response) => {

    // if (!ObjectId.isValid(req.params.id)) {
    //     res.sendStatus(404);
    // }
    // const foundPost = await postsService.find(new ObjectId(req.params.id))
    // if (!foundPost) {
    //     res.sendStatus(404);
    //     return;
    // }
    // await postsService.deletePost(new ObjectId(req.params.id));
    //
    // res.sendStatus(204);

    const resultObject = await postsService.deletePost(req.params.id);

    if (resultObject.status === ResultStatus.NotFound) {
        res.sendStatus(404);
        return
    }
    if (resultObject.status === ResultStatus.InternalServerError) {
        res.sendStatus(500);
        return
    }
    if (resultObject.status === ResultStatus.Success) {
        res.sendStatus(204);
    }
}