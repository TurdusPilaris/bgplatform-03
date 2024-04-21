import {Router} from "express";
import {
    authMiddleware, authMiddlewareBearer, commentInputValidator, getUserIdWithoutAuth,
    inputValidationMiddleware,
    postInputValidatorPost
} from "../../middlewares/input-validation-middleware";
import {container} from "../../composition-root";
import {PostsController} from "./controllers/postsController";
import {CommentsController} from "../feedBacks/controllers/commentsController";


const postsController = container.resolve(PostsController)
const commentsController = container.resolve(CommentsController)
export const postsRouter = Router();

postsRouter.get('/', getUserIdWithoutAuth,  postsController.getPostsController.bind(postsController));
postsRouter.get('/:id', getUserIdWithoutAuth, postsController.getPostsControllerByID.bind(postsController));
postsRouter.post('/', authMiddleware, postInputValidatorPost,   inputValidationMiddleware, postsController.postForPostsController.bind(postsController));
postsRouter.put('/:id', authMiddleware, postInputValidatorPost, inputValidationMiddleware,  postsController.putPostsController.bind(postsController));
postsRouter.delete('/:id', authMiddleware, postsController.deletePostsController.bind(postsController));
postsRouter.post('/:postId/comments', authMiddlewareBearer,commentInputValidator, inputValidationMiddleware, commentsController.postCommentsForPostController.bind(commentsController));
postsRouter.get('/:postId/comments', getUserIdWithoutAuth, commentsController.getCommentForPost.bind(commentsController));
postsRouter.put("/:id/like-status", authMiddlewareBearer, postsController.putLikeStatusForPost.bind(postsController))