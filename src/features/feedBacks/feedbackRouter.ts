import {Router} from "express";
import {
    authMiddlewareBearer,
    commentInputValidator, inputValidationMiddleware
} from "../../middlewares/input-validation-middleware";
import {getCommentsControllerById} from "./controllers/getCommentsControllerById";
import {deleteCommentsController} from "./controllers/deleteCommentsController";
import {putCommentsController} from "./controllers/putCommentsController";
//
export const feedbackRouter = Router()

// class FeedbackRouter {
//     getCommentsControllerById
//     deleteCommentsController
//     putCommentsController
// }
feedbackRouter.get("/:id", getCommentsControllerById)
feedbackRouter.delete("/:id", authMiddlewareBearer, deleteCommentsController)
feedbackRouter.put("/:id", authMiddlewareBearer, commentInputValidator, inputValidationMiddleware, putCommentsController)