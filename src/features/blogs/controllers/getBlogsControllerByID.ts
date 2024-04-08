import { Request, Response} from "express";
import {ObjectId} from "mongodb";
import {blogsService} from "../domain/blogs-service"
import {TypeBlogViewModel} from "../types/outputTypes";
import {blogQueryRepository} from "../repositories/blogQueryRepository";
import {ResultStatus} from "../../../common/types/resultCode";

export const getBlogsControllerByID = async( req: Request<any, any, any, any>, res: Response<TypeBlogViewModel>) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return;
    }
    const foundBlog = await blogQueryRepository.findForOutput(new ObjectId(req.params.id));
    if(!foundBlog) {
        res.sendStatus(404)
        return;
    }
    res
        .status(200)
        .send(foundBlog);
}