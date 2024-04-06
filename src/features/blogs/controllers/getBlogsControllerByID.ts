import { Request, Response} from "express";
import {ObjectId} from "mongodb";
import {blogsService} from "../domain/blogs-service"
import {TypeBlogViewModel} from "../types/outputTypes";
import {blogQueryRepository} from "../repositories/blogQueryRepository";

export const getBlogsControllerByID = async( req: Request<any, any, any, any>, res: Response<TypeBlogViewModel>) => {

    const foundBlog = await blogQueryRepository.findForOutput(new ObjectId(req.params.id));
    if(!foundBlog) {
        res.sendStatus(404)
        return;
    }
    res
        .status(200)
        .send(foundBlog);
}