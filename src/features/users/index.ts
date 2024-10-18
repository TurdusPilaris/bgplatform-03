import {Router} from "express";
import {
    authMiddleware,
    inputValidationMiddleware,
    userInputValidator
} from "../../middlewares/input-validation-middleware";
import {container} from "../../composition-root";
import {UsersController} from "./api/usersController";

// const usersController  = ioc.getInstance<UsersController>(UsersController)
const usersController  = container.resolve(UsersController);
export const usersRouter = Router();

usersRouter.post('/',authMiddleware, userInputValidator, inputValidationMiddleware, usersController.postUserController.bind(usersController));
usersRouter.get('/', authMiddleware, usersController.getUsersController.bind(usersController));
usersRouter.delete('/:id', authMiddleware, usersController.deleteUsersController.bind(usersController));

