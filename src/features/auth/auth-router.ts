import {Router} from "express";

import {
    apiRequestLimitMiddleware,
    authMiddlewareBearer, authMiddlewareRefreshToken, emailInputValidator,
    inputValidationMiddleware,
    userInputValidator, userNewPasswordValidator
} from "../../middlewares/input-validation-middleware";
import {authController} from "../../composition-root";

export const authRouter = Router({})

authRouter.post('/login', apiRequestLimitMiddleware, authController.postLoginAuthControllers.bind(authController))
authRouter.post('/registration', apiRequestLimitMiddleware, userInputValidator, inputValidationMiddleware, authController.postRegistrationControllers.bind(authController))
authRouter.post('/registration-confirmation', apiRequestLimitMiddleware, authController.postRegisrtationConfirmationController.bind(authController))
authRouter.post('/registration-email-resending', apiRequestLimitMiddleware, emailInputValidator, inputValidationMiddleware, authController.postRegistrationEmailResendingController.bind(authController))
authRouter.get('/me', authMiddlewareBearer, authController.getInformationMe.bind(authController))
authRouter.post('/refresh-token', authMiddlewareRefreshToken, authController.postRefreshTokenController.bind(authController))
authRouter.post('/logout', authMiddlewareRefreshToken, authController.postLogOutControllers.bind(authController))
authRouter.post('/new-password', apiRequestLimitMiddleware,userNewPasswordValidator,inputValidationMiddleware, authController.postNewPasswordController.bind(authController))
authRouter.post('/password-recovery', apiRequestLimitMiddleware, emailInputValidator, inputValidationMiddleware, authController.postPasswordRecoveryController.bind(authController))

