import {Router} from "express";
import {getPostsController} from "../posts/controllers/getPostsController";
import {postsRouter} from "../posts";
import {getDevicesController} from "./controllers/getDevicesController";
import {authMiddlewareRefreshToken} from "../../middlewares/input-validation-middleware";
import {deleteDevicesController} from "./controllers/deleteDevicesController";
import {deleteDevicesByIDController} from "./controllers/deleteDevicesByIDController";

export const securityRouter = Router();


securityRouter.get('/devices', authMiddlewareRefreshToken, getDevicesController);
securityRouter.delete('/devices', authMiddlewareRefreshToken, deleteDevicesController);
securityRouter.delete('/devices/:id', authMiddlewareRefreshToken, deleteDevicesByIDController);