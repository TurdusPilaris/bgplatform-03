import { Request, Response} from "express";
import {HelperQueryTypePost} from "../../../input-output-types/inputTypes";
import {postQueryRepository} from "../repositories/postQueryRepository";
import {PaginatorPostType} from "../../../input-output-types/posts/outputTypes";
import {postsService} from "../domain/posts-service";

export const getPostsController = async (req: Request<any, any, any, any>, res: Response<PaginatorPostType>) => {

    const helper = (query:any) => {
        const queryHelper: HelperQueryTypePost = {
            pageNumber: query.pageNumber ? +query.pageNumber : 1,
            pageSize: query.pageSize ? +query.pageSize : 10,
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: query.sortDirection ? query.sortDirection : 'desc',

        }
        return queryHelper;
    }

    const result = await postsService.getAllPosts(helper(req.query))

    res
        .status(200)
        .send(result.data);

}