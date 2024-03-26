import {Router} from "express";
import {deleteAllController} from "./controllers/deleteAllController";
export const testingRouter = Router();

testingRouter.delete('/all-data', deleteAllController);