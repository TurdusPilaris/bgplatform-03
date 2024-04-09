import {Request, Response} from "express";
import {blogsService} from "../domain/blogs-service"
import {TypeBlogInputModel} from "../types/inputTypes";
import {TypeBlogViewModel} from "../types/outputTypes";
import {ParamsType} from "../../../input-output-types/inputTypes";
import {ResultStatus} from "../../../common/types/resultCode";

export const postBlogsController = async (req: Request<ParamsType, TypeBlogInputModel>, res: Response<TypeBlogViewModel|null>) => {

    //NEW
    const resultObject = await blogsService.create(req.body);

    if(resultObject.status === ResultStatus.InternalServerError){
        res.sendStatus(500);
        return;
    }

    if(resultObject.status === ResultStatus.Success){
        res
                 .status(201)
                 .send(resultObject.data);
    }

}