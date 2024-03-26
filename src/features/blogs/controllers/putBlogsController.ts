import {Request, Response} from "express";
import {blogsService} from "../domain/blogs-service"
import {TypeBlogInputModel} from "../../../input-output-types/blogs/inputTypes";
import {TypeBlogViewModel} from "../../../input-output-types/blogs/outputTypes";
import {ParamsType} from "../../../input-output-types/inputTypes";
import {ResultStatus} from "../../../common/types/resultCode";

export const putBlogsController = async (req: Request<ParamsType, TypeBlogInputModel>, res: Response<TypeBlogViewModel>) => {

    const resultObject = await blogsService.updateBlog(req.params.id, req.body);

    if (!resultObject.data) {
        if (resultObject.status === ResultStatus.NotFound) {
            res.sendStatus(404)
            return;
        }
    } else if(resultObject.status === ResultStatus.Success){
       res.status(204).send(resultObject.data);
       return;
    }

}