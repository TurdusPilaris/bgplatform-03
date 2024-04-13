import {Router} from "express";
import {
    authMiddlewareBearer,
    commentInputValidator, inputValidationMiddleware
} from "../../middlewares/input-validation-middleware";
import {commentsController} from "../../composition-root";
//
export const feedbackRouter = Router()

feedbackRouter.get("/:id", commentsController.getCommentsControllerById.bind(commentsController))
feedbackRouter.delete("/:id", authMiddlewareBearer, commentsController.deleteCommentsController.bind(commentsController))
feedbackRouter.put("/:id", authMiddlewareBearer, commentInputValidator, inputValidationMiddleware, commentsController.putCommentsController.bind(commentsController))
feedbackRouter.put("/:id/like-status", authMiddlewareBearer, commentsController.putLikeStatusForComment.bind(commentsController))