import {Router} from "express";
import {authMiddlewareRefreshToken} from "../../middlewares/input-validation-middleware";
import {DevicesController} from "./controllers/devicesController";

export const securityRouter = Router();

export const devicesController = new DevicesController();

securityRouter.get('/devices', authMiddlewareRefreshToken, devicesController.getDevicesController);
securityRouter.delete('/devices', authMiddlewareRefreshToken, devicesController.deleteDevicesController);
securityRouter.delete('/devices/:id', authMiddlewareRefreshToken, devicesController.deleteDevicesByIDController);