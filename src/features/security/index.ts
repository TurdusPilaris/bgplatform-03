import {Router} from "express";
import {authMiddlewareRefreshToken} from "../../middlewares/input-validation-middleware";
import { devicesController } from "../../composition-root";

export const securityRouter = Router();


securityRouter.get('/devices', authMiddlewareRefreshToken, devicesController.getDevicesController.bind(devicesController));
securityRouter.delete('/devices', authMiddlewareRefreshToken, devicesController.deleteDevicesController.bind(devicesController));
securityRouter.delete('/devices/:id', authMiddlewareRefreshToken, devicesController.deleteDevicesByIDController.bind(devicesController));