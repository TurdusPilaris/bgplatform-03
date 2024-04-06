import {Request, Response} from "express";
import {blogsService} from "../domain/blogs-service"
import {ParamsType} from "../../../input-output-types/inputTypes";
import {ResultStatus} from "../../../common/types/resultCode";

export const deleteBlogsController = async (req: Request<ParamsType>, res: Response) => {

    // if (!ObjectId.isValid(req.params.id)) {
    //     res.sendStatus(404);
    //     return;
    // }
    // const foundBlog = await blogsService.find(new ObjectId(req.params.id))
    // if (!foundBlog) {
    //     res.sendStatus(404);
    //     return;
    // }
    const resultObject = await blogsService.deleteBlog(req.params.id);

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