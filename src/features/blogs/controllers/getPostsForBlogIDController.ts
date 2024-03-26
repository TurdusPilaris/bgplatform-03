import {Request, Response} from "express";
import {SortDirection} from "mongodb";
import {blogQueryRepository} from "../repositories/blogQueryRepository";
import {PaginatorPostType} from "../../../input-output-types/posts/outputTypes";
import {HelperQueryTypePost} from "../../../input-output-types/inputTypes";

const helper = (query: any):HelperQueryTypePost => {
    return {
            pageNumber: query.pageNumber ? +query.pageNumber : 1,
            pageSize: query.pageSize ? +query.pageSize : 10,
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
        }

}
export const getPostsForBlogID = async (req: Request<any, any, any, any>, res: Response<PaginatorPostType>) => {

    const answer = await blogQueryRepository.getMany(helper(req.query), req.params.blogId);
    res
        .status(200)
        .send(answer);
}