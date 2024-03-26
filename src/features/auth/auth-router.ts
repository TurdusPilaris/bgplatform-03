import {Router} from "express";
import {postLoginAuthControllers} from "./controllers/postLoginAuthControllers";
import {postRegistrationControllers} from "./controllers/postRegistrationController";
import {
    authMiddlewareBearer, authMiddlewareRefreshToken, emailInputValidator,
    inputValidationMiddleware,
    userInputValidator
} from "../../middlewares/input-validation-middleware";
import {postRegisrtationConfirmationController} from "./controllers/postRegisrtationConfirmationController";
import {getInformationMe} from "./controllers/getInformationMeController";
import {postRegistrationEmailResendingController} from "./controllers/postRegistrationEmailResendingController";
import {postRefreshTokenController} from "./controllers/postRefreshTokenController";
import {postLogOutControllers} from "./controllers/postLogOutController";

export const authRouter = Router({})

authRouter.post('/login', postLoginAuthControllers)
authRouter.post('/registration', userInputValidator, inputValidationMiddleware, postRegistrationControllers)
authRouter.post('/registration-confirmation', postRegisrtationConfirmationController)
authRouter.post('/registration-email-resending', emailInputValidator, inputValidationMiddleware, postRegistrationEmailResendingController)
authRouter.get('/me', authMiddlewareBearer, getInformationMe)
authRouter.post('/refresh-token', authMiddlewareRefreshToken, postRefreshTokenController)
authRouter.post('/logout', authMiddlewareRefreshToken, postLogOutControllers)

