import { Request, Response} from "express";

import {HelperQueryTypeBlog} from "../../../input-output-types/inputTypes";
import {blogQueryRepository} from "../repositories/blogQueryRepository";
import {blogsService} from "../domain/blogs-service";
export const getBlogsController = async (req: Request, res: Response) => {

    const helper = (query:any) => {

        const queryHelper: HelperQueryTypeBlog = {
            searchNameTerm: query.searchNameTerm? query.searchNameTerm: null,
            pageNumber: query.pageNumber ? +query.pageNumber : 1,
            pageSize: query.pageSize ? +query.pageSize : 10,
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: query.sortDirection ? query.sortDirection : 'desc',

        }
        return queryHelper;
    }

    const result = await blogsService.getAllBlogs(helper(req.query));

    res

        .status(200)
         .send(result.data);

}