import {Request, Response} from "express";
import {TypeBlogInputModel} from "../../blogs/types/inputTypes";
import {postsService} from "../domain/posts-service";
import {ResultStatus} from "../../../common/types/resultCode";
import {HelperQueryTypeComment, HelperQueryTypePost, ParamsType} from "../../../input-output-types/inputTypes";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {PaginatorPostType, TypePostViewModel} from "../../../input-output-types/posts/outputTypes";
import {ObjectId, SortDirection} from "mongodb";
import {postQueryRepository} from "../repositories/postQueryRepository";
import {PaginatorCommentsType} from "../../../input-output-types/comments/outputTypes";
import {commentQueryRepository} from "../../feedBacks/reepositories/commentQueryRepository";
import {feedbacksService} from "../../feedBacks/domain/feedbacks-service";

export class PostsController {
    async postForPostsController(req: Request<TypeBlogInputModel>, res: Response) {

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
    async putPostsController(req: Request<ParamsType, TypePostInputModelModel, any, any>, res: Response<TypePostViewModel>) {

        const resultObject = await  postsService.updatePost(req.params.id, req.body);

        if (!resultObject.data) {
            if (resultObject.status === ResultStatus.NotFound) {
                res.sendStatus(404)
                return;
            }
        } else if(resultObject.status === ResultStatus.Success){
            res.status(204).send(resultObject.data);
            return;
        }
    }
    async getPostsControllerByID(req: Request<any, any, any, any>, res: Response)  {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(404)
            return;
        }

        const foundPost = await postQueryRepository.findForOutput(new ObjectId(req.params.id));
        if(!foundPost) {
            res.sendStatus(404)
            return
        }
        res
            .status(200)
            .send(foundPost);

    }
    async getPostsController (req: Request<any, any, any, any>, res: Response<PaginatorPostType>){

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
    async deletePostsController(req: Request<ParamsType>, res: Response) {

        const resultObject = await postsService.deletePost(req.params.id);

        if (resultObject.status === ResultStatus.NotFound) {
            res.sendStatus(404);
            return
        }
        if (resultObject.status === ResultStatus.InternalServerError) {
            res.sendStatus(500);
            return
        }
        if (resultObject.status === ResultStatus.Success) {
            res.sendStatus(204);
        }
    }
    async getCommentForPost(req: Request<any, any, any, any>, res: Response<PaginatorCommentsType>){

        const helper = (query: any):HelperQueryTypeComment => {
            return {
                pageNumber: query.pageNumber ? +query.pageNumber : 1,
                pageSize: query.pageSize ? +query.pageSize : 10,
                sortBy: query.sortBy ? query.sortBy : 'createdAt',
                sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
            }

        }

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
    async postCommentsForPostController(req: Request, res: Response) {

        const resultObject = await feedbacksService.createComment(req.body.content, req.params.postId, req.userId!);

        if(resultObject.status === ResultStatus.NotFound){
            res.sendStatus(404);
            return;
        }
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
}