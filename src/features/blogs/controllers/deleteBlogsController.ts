import { Request, Response} from "express";
import {ObjectId} from "mongodb";
import {blogsService} from "../domain/blogs-service"
import {ParamsType} from "../../../input-output-types/inputTypes";
export const deleteBlogsController = async (req: Request<ParamsType>, res: Response) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404);
        return;
    }
    const foundBlog = await blogsService.find(new ObjectId(req.params.id))
    if (!foundBlog) {
        res.sendStatus(404);
        return;
    }
    await blogsService.deleteBlog(new ObjectId(req.params.id));

    res.sendStatus(204);

}