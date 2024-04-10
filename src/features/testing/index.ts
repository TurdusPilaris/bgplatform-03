import {Router} from "express";
import {TestingController} from "./controllers/testingController";
export const testingRouter = Router();

export const testingController = new TestingController();
testingRouter.delete('/all-data', testingController.deleteAllController);