import {Router} from "express";
import {authMiddlewareRefreshToken} from "../../middlewares/input-validation-middleware";
import { container } from "../../composition-root";
import {DevicesController} from "./controllers/devicesController";

const devicesController = container.resolve(DevicesController)
export const securityRouter = Router();


securityRouter.get('/devices', authMiddlewareRefreshToken, devicesController.getDevicesController.bind(devicesController));
securityRouter.delete('/devices', authMiddlewareRefreshToken, devicesController.deleteDevicesController.bind(devicesController));
securityRouter.delete('/devices/:id', authMiddlewareRefreshToken, devicesController.deleteDevicesByIDController.bind(devicesController));