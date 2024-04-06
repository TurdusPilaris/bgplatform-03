import { Request, Response} from "express";
import {InsertedInfoType,} from "../../../input-output-types/inputOutputTypesMongo";
import {TypeBlogInputModel} from "../../blogs/types/inputTypes";
import {postsService} from "../domain/posts-service";

export const postForPostsController = async (req: Request<TypeBlogInputModel>, res: Response) => {


    const insertedInfo: InsertedInfoType |undefined = await postsService.create(req.body);

    if(insertedInfo){
        const newPost = await  postsService.findForOutput(insertedInfo.insertedId);
        res
            .status(201)
            .send(newPost);
    }



}