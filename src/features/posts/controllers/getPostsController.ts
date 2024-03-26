import { Request, Response} from "express";
import {HelperQueryTypePost} from "../../../input-output-types/inputTypes";
import {postQueryRepository} from "../repositories/postQueryRepository";
import {PaginatorPostType} from "../../../input-output-types/posts/outputTypes";

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

    res
        .status(200)
        .send(await postQueryRepository.getAllPosts(helper(req.query)));

}