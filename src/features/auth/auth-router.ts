import {Router} from "express";
import {postLoginAuthControllers} from "./controllers/postLoginAuthControllers";
import {postRegistrationControllers} from "./controllers/postRegistrationController";
import {
    apiRequestLimitMiddleware,
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

authRouter.post('/login', apiRequestLimitMiddleware, postLoginAuthControllers)
authRouter.post('/registration', userInputValidator, apiRequestLimitMiddleware, inputValidationMiddleware, postRegistrationControllers)
authRouter.post('/registration-confirmation', apiRequestLimitMiddleware, postRegisrtationConfirmationController)
authRouter.post('/registration-email-resending', apiRequestLimitMiddleware, emailInputValidator, inputValidationMiddleware, postRegistrationEmailResendingController)
authRouter.get('/me', authMiddlewareBearer, getInformationMe)
authRouter.post('/refresh-token', authMiddlewareRefreshToken, postRefreshTokenController)
authRouter.post('/logout', authMiddlewareRefreshToken, postLogOutControllers)

