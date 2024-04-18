import {Router} from "express";
import {container} from "../../composition-root";
import {TestingController} from "./controllers/testingController";

const testingController = container.resolve(TestingController)
export const testingRouter = Router();

testingRouter.delete('/all-data', testingController.deleteAllController.bind(testingController));