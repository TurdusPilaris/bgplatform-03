import { Request, Response} from "express";
import {InsertedInfoType} from "../../../input-output-types/inputOutputTypesMongo";
import {blogsService} from "../domain/blogs-service"
import {TypeBlogInputModel} from "../types/inputTypes";
import {TypeBlogViewModel} from "../types/outputTypes";
import { ParamsType } from "../../../input-output-types/inputTypes";
import {blogQueryRepository} from "../repositories/blogQueryRepository";
export const postBlogsController = async (req: Request<ParamsType, TypeBlogInputModel>, res: Response<TypeBlogViewModel>) => {

    //OLD
    // const insertedInfo = await blogsService.create(req.body);
    //
    // if(insertedInfo){
    //     const newBlog = await  blogQueryRepository.findForOutput(insertedInfo.insertedId);
    //     res
    //         .status(201)
    //         .send(newBlog);
    // } else {
    //     res.sendStatus(500);
    // }
    //

    //NEW
    const createdID = await blogsService.create(req.body);

    if(createdID){

        const newBlog = await  blogQueryRepository.findForOutput(createdID);
        console.log("Im here!", createdID)
        console.log("newBlog!", newBlog)
        res
            .status(201)
            .send(newBlog);
    } else {
        res.sendStatus(500);
    }


}