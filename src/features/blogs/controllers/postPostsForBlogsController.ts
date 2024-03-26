import { Request, Response} from "express";
import {InsertedInfoType} from "../../../input-output-types/inputOutputTypesMongo";
import {blogsService} from "../domain/blogs-service"
import {TypePostViewModel} from "../../../input-output-types/posts/outputTypes";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {postsService} from "../../posts/domain/posts-service";
export const postPostsForBlogsController = async (req: Request<{ blogId: string}, TypePostInputModelModel, any, any>, res: Response<TypePostViewModel>) => {

    const insertedInfo: InsertedInfoType |undefined = await blogsService.createPostForBlog(req.body, req.params.blogId);

    if(insertedInfo){
        const newPost = await  postsService.findForOutput(insertedInfo.insertedId);
        res
            .status(201)
            .send(newPost);
    }


}