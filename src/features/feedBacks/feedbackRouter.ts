import {Router} from "express";
import {
    authMiddlewareBearer,
    commentInputValidator, getUserIdWithoutAuth, inputValidationMiddleware
} from "../../middlewares/input-validation-middleware";
import {container} from "../../composition-root";
import {CommentsController} from "./controllers/commentsController";
//
const commentsController = container.resolve(CommentsController)
export const feedbackRouter = Router()

feedbackRouter.get("/:id", getUserIdWithoutAuth, commentsController.getCommentsControllerById.bind(commentsController))
feedbackRouter.delete("/:id", authMiddlewareBearer, commentsController.deleteCommentsController.bind(commentsController))
feedbackRouter.put("/:id", authMiddlewareBearer, commentInputValidator, inputValidationMiddleware, commentsController.putCommentsController.bind(commentsController))
feedbackRouter.put("/:id/like-status", authMiddlewareBearer, commentsController.putLikeStatusForComment.bind(commentsController))
// feedbackRouter.put("/:id/like-status", commentsController.putLikeStatusForComment.bind(commentsController))