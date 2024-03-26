import {Router} from "express";
import {postUserController} from "./controllers/postUsersController";
import {getUsersController} from "./controllers/getUsersController";
import {
    authMiddleware,
    inputValidationMiddleware,
    userInputValidator
} from "../../middlewares/input-validation-middleware";
import {deleteUsersController} from "./controllers/deleteUserController";


export const usersRouter = Router();


usersRouter.post('/',authMiddleware, userInputValidator, inputValidationMiddleware, postUserController);
usersRouter.get('/', authMiddleware, getUsersController);
usersRouter.delete('/:id', authMiddleware, deleteUsersController);

