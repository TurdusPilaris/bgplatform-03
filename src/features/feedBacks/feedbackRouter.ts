import {Router} from "express";
import {
    authMiddlewareBearer,
    commentInputValidator, inputValidationMiddleware
} from "../../middlewares/input-validation-middleware";
import {CommentsController} from "./controllers/commentsController";
//
export const feedbackRouter = Router()

export const commentController = new CommentsController();

feedbackRouter.get("/:id", commentController.getCommentsControllerById)
feedbackRouter.delete("/:id", authMiddlewareBearer, commentController.deleteCommentsController)
feedbackRouter.put("/:id", authMiddlewareBearer, commentInputValidator, inputValidationMiddleware, commentController.putCommentsController)