import {Router} from "express";
import {
    authMiddleware, authMiddlewareBearer, commentInputValidator, getUserIdWithoutAuth,
    inputValidationMiddleware,
    postInputValidatorPost
} from "../../middlewares/input-validation-middleware";
import {container} from "../../composition-root";
import {PostsController} from "./controllers/postsController";


const postsController = container.resolve(PostsController)
export const postsRouter = Router();

postsRouter.get('/', postsController.getPostsController.bind(postsController));
postsRouter.get('/:id', postsController.getPostsControllerByID.bind(postsController));
postsRouter.post('/', authMiddleware, postInputValidatorPost,   inputValidationMiddleware, postsController.postForPostsController.bind(postsController));
postsRouter.put('/:id', authMiddleware, postInputValidatorPost, inputValidationMiddleware,  postsController.putPostsController.bind(postsController));
postsRouter.delete('/:id', authMiddleware, postsController.deletePostsController.bind(postsController));
postsRouter.post('/:postId/comments', authMiddlewareBearer,commentInputValidator, inputValidationMiddleware, postsController.postCommentsForPostController.bind(postsController));
postsRouter.get('/:postId/comments', getUserIdWithoutAuth, postsController.getCommentForPost.bind(postsController));
postsRouter.put("/:id/like-status", authMiddlewareBearer, postsController.putLikeStatusForPost.bind(postsController))