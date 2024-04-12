import {Router} from "express";
import {
    authMiddleware, authMiddlewareBearer, commentInputValidator,
    inputValidationMiddleware,
    postInputValidatorPost
} from "../../middlewares/input-validation-middleware";
import {postsController} from "../../composition-root";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPostsController);
postsRouter.get('/:id', postsController.getPostsControllerByID);
postsRouter.post('/', authMiddleware, postInputValidatorPost,   inputValidationMiddleware, postsController.postForPostsController);
postsRouter.put('/:id', authMiddleware, postInputValidatorPost, inputValidationMiddleware,  postsController.putPostsController);
postsRouter.delete('/:id', authMiddleware, postsController.deletePostsController);
postsRouter.post('/:postId/comments', authMiddlewareBearer,commentInputValidator, inputValidationMiddleware, postsController.postCommentsForPostController);
postsRouter.get('/:postId/comments', postsController.getCommentForPost);