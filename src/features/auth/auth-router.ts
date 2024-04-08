import {Router} from "express";
import {postLoginAuthControllers} from "./controllers/postLoginAuthControllers";
import {postRegistrationControllers} from "./controllers/postRegistrationController";
import {
    apiRequestLimitMiddleware,
    authMiddlewareBearer, authMiddlewareRefreshToken, emailInputValidator,
    inputValidationMiddleware,
    userInputValidator, userNewPasswordValidator
} from "../../middlewares/input-validation-middleware";
import {postRegisrtationConfirmationController} from "./controllers/postRegisrtationConfirmationController";
import {getInformationMe} from "./controllers/getInformationMeController";
import {postRegistrationEmailResendingController} from "./controllers/postRegistrationEmailResendingController";
import {postRefreshTokenController} from "./controllers/postRefreshTokenController";
import {postLogOutControllers} from "./controllers/postLogOutController";
import {postPasswordRecoveryController} from "./controllers/postPasswordRecoveryController";
import {postNewPasswordController} from "./controllers/postNewPasswordController";

export const authRouter = Router({})

authRouter.post('/login', apiRequestLimitMiddleware, postLoginAuthControllers)
authRouter.post('/registration', apiRequestLimitMiddleware, userInputValidator, inputValidationMiddleware, postRegistrationControllers)
authRouter.post('/registration-confirmation', apiRequestLimitMiddleware, postRegisrtationConfirmationController)
authRouter.post('/registration-email-resending', apiRequestLimitMiddleware, emailInputValidator, inputValidationMiddleware, postRegistrationEmailResendingController)
authRouter.get('/me', authMiddlewareBearer, getInformationMe)
authRouter.post('/refresh-token', authMiddlewareRefreshToken, postRefreshTokenController)
authRouter.post('/logout', authMiddlewareRefreshToken, postLogOutControllers)
authRouter.post('/new-password', apiRequestLimitMiddleware,userNewPasswordValidator,inputValidationMiddleware, postNewPasswordController)
authRouter.post('/password-recovery', apiRequestLimitMiddleware, emailInputValidator, inputValidationMiddleware, postPasswordRecoveryController )

