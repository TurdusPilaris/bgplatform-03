import {Router} from "express";

import {
    apiRequestLimitMiddleware,
    authMiddlewareBearer, authMiddlewareRefreshToken, emailInputValidator,
    inputValidationMiddleware,
    userInputValidator, userNewPasswordValidator
} from "../../middlewares/input-validation-middleware";

import {AuthController} from "./controllers/authController";

export const authRouter = Router({})

export const authController = new AuthController();

authRouter.post('/login', apiRequestLimitMiddleware, authController.postLoginAuthControllers)
authRouter.post('/registration', apiRequestLimitMiddleware, userInputValidator, inputValidationMiddleware, authController.postRegistrationControllers)
authRouter.post('/registration-confirmation', apiRequestLimitMiddleware, authController.postRegisrtationConfirmationController)
authRouter.post('/registration-email-resending', apiRequestLimitMiddleware, emailInputValidator, inputValidationMiddleware, authController.postRegistrationEmailResendingController)
authRouter.get('/me', authMiddlewareBearer, authController.getInformationMe)
authRouter.post('/refresh-token', authMiddlewareRefreshToken, authController.postRefreshTokenController)
authRouter.post('/logout', authMiddlewareRefreshToken, authController.postLogOutControllers)
authRouter.post('/new-password', apiRequestLimitMiddleware,userNewPasswordValidator,inputValidationMiddleware, authController.postNewPasswordController)
authRouter.post('/password-recovery', apiRequestLimitMiddleware, emailInputValidator, inputValidationMiddleware, authController.postPasswordRecoveryController )

