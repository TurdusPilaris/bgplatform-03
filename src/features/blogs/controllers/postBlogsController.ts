import { Request, Response} from "express";
import {InsertedInfoType} from "../../../input-output-types/inputOutputTypesMongo";
import {blogsService} from "../domain/blogs-service"
import {TypeBlogInputModel} from "../../../input-output-types/blogs/inputTypes";
import {TypeBlogViewModel} from "../../../input-output-types/blogs/outputTypes";
import { ParamsType } from "../../../input-output-types/inputTypes";
import {blogQueryRepository} from "../repositories/blogQueryRepository";
export const postBlogsController = async (req: Request<ParamsType, TypeBlogInputModel>, res: Response<TypeBlogViewModel>) => {

    const insertedInfo: InsertedInfoType |undefined = await blogsService.create(req.body);

    if(insertedInfo){
        const newBlog = await  blogQueryRepository.findForOutput(insertedInfo.insertedId);
        res
            .status(201)
            .send(newBlog);
    } else {
        res.sendStatus(500);
    }


}