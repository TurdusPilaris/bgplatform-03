import {Router} from "express";
import {getPostsController} from "./controllers/getPostsController";
import {deletePostsController} from "./controllers/deletePostsController";
import {
    authMiddleware, authMiddlewareBearer, commentInputValidator,
    inputValidationMiddleware,
    postInputValidatorPost
} from "../../middlewares/input-validation-middleware";
import {getPostsControllerByID} from "./controllers/getPostsControllerByID";
import {postForPostsController} from "./controllers/postForPostsController";
import {putPostsController} from "./controllers/putPostsController";
import {postCommentsForPostController} from "./controllers/postCommentsForPostController";
import {getCommentForPost} from "./controllers/getCommentForPostController";

export const postsRouter = Router();

postsRouter.get('/', getPostsController);
postsRouter.get('/:id', getPostsControllerByID);
postsRouter.post('/', authMiddleware, postInputValidatorPost,   inputValidationMiddleware, postForPostsController);
postsRouter.put('/:id', authMiddleware, postInputValidatorPost, inputValidationMiddleware,  putPostsController);
postsRouter.delete('/:id', authMiddleware, deletePostsController);
postsRouter.post('/:postId/comments', authMiddlewareBearer,commentInputValidator, inputValidationMiddleware, postCommentsForPostController);
postsRouter.get('/:postId/comments', getCommentForPost);