import { Request, Response} from "express";
import {UserQueryType} from "../../../input-output-types/inputTypes";
import {userQueryRepository} from "../repositories/userQueryRepository";

export const getUsersController = async (req: Request, res: Response) => {

    const helper = (query:any) => {
        const queryHelper: UserQueryType = {

            pageNumber: query.pageNumber ? +query.pageNumber : 1,
            pageSize: query.pageSize ? +query.pageSize : 10,
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: query.sortDirection ? query.sortDirection : 'desc',
            searchLoginTerm: query.searchLoginTerm? query.searchLoginTerm: null,
            searchEmailTerm: query.searchEmailTerm? query.searchEmailTerm: null,

        }
        return queryHelper;
    }

    res
        .status(200)
        .send(await userQueryRepository.getAllUsers(helper(req.query)));

}