import { Request, Response} from "express";
import {InsertedInfoType,} from "../../../input-output-types/inputOutputTypesMongo";
import {TypeBlogInputModel} from "../../blogs/types/inputTypes";
import {postsService} from "../domain/posts-service";
import {blogsService} from "../../blogs/domain/blogs-service";
import {ResultStatus} from "../../../common/types/resultCode";

export const postForPostsController = async (req: Request<TypeBlogInputModel>, res: Response) => {

    // const insertedInfo: InsertedInfoType |undefined = await postsService.create(req.body);
    //
    // if(insertedInfo){
    //     const newPost = await  postsService.findForOutput(insertedInfo.insertedId);
    //     res
    //         .status(201)
    //         .send(newPost);
    // }

    //NEW
    const resultObject = await postsService.create(req.body);

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