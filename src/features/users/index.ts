import {Router} from "express";
import {
    authMiddleware,
    inputValidationMiddleware,
    userInputValidator
} from "../../middlewares/input-validation-middleware";
import {UsersController} from "./controllers/usersController";


export const usersRouter = Router();

export const usersController = new UsersController();

usersRouter.post('/',authMiddleware, userInputValidator, inputValidationMiddleware, usersController.postUserController);
usersRouter.get('/', authMiddleware, usersController.getUsersController);
usersRouter.delete('/:id', authMiddleware, usersController.deleteUsersController);

