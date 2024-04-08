import { Request, Response} from "express";
import {InsertedInfoType} from "../../../input-output-types/inputOutputTypesMongo";
import {blogsService} from "../domain/blogs-service"
import {TypePostViewModel} from "../../../input-output-types/posts/outputTypes";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {postsService} from "../../posts/domain/posts-service";
import {postQueryRepository} from "../../posts/repositories/postQueryRepository";
import {ResultStatus} from "../../../common/types/resultCode";
export const postPostsForBlogsController = async (req: Request<{ blogId: string}, TypePostInputModelModel, any, any>, res: Response) => {

    const resultObject = await blogsService.createPostForBlog(req.body, req.params.blogId);

    if (resultObject.status === ResultStatus.NotFound) {
        res
            .status(404)
            .send({errorsMessages: [{message: resultObject.errorMessage, field: resultObject.errorField}]})
        return
    }
    // if (resultObject.status === ResultStatus.InternalServerError) {
    //     res.sendStatus(500);
    //     return
    // }
    if (resultObject.status === ResultStatus.Success) {
        res
            .status(201)
            .send(resultObject.data!);
    }



}