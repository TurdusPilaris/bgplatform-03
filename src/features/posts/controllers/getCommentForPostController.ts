import {Request, Response} from "express";
import {ObjectId, SortDirection} from "mongodb";
import {HelperQueryTypeComment} from "../../../input-output-types/inputTypes";
import {commentQueryRepository} from "../../feedBacks/reepositories/commentQueryRepository";
import {PaginatorCommentsType} from "../../../input-output-types/comments/outputTypes";
import {postQueryRepository} from "../repositories/postQueryRepository";

const helper = (query: any):HelperQueryTypeComment => {
    return {
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize ? +query.pageSize : 10,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
    }

}
export const getCommentForPost = async (req: Request<any, any, any, any>, res: Response<PaginatorCommentsType>) => {

    const post = await postQueryRepository.findForOutput(new ObjectId(req.params.postId))
    if (!post) {
        res.sendStatus(404)
        return
    }
    const answer = await commentQueryRepository.getMany(helper(req.query), req.params.postId);
    res
        .status(200)
        .send(answer);
}