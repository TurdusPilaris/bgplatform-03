import {Router} from "express";
import {
    authMiddleware, authMiddlewareBearer, commentInputValidator,
    inputValidationMiddleware,
    postInputValidatorPost
} from "../../middlewares/input-validation-middleware";
import {postsController} from "../../composition-root";

export const postsRouter = Router();

postsRouter.get('/', postsController.getPostsController.bind(postsController));
postsRouter.get('/:id', postsController.getPostsControllerByID.bind(postsController));
postsRouter.post('/', authMiddleware, postInputValidatorPost,   inputValidationMiddleware, postsController.postForPostsController.bind(postsController));
postsRouter.put('/:id', authMiddleware, postInputValidatorPost, inputValidationMiddleware,  postsController.putPostsController.bind(postsController));
postsRouter.delete('/:id', authMiddleware, postsController.deletePostsController.bind(postsController));
postsRouter.post('/:postId/comments', authMiddlewareBearer,commentInputValidator, inputValidationMiddleware, postsController.postCommentsForPostController.bind(postsController));
postsRouter.get('/:postId/comments', postsController.getCommentForPost.bind(postsController));