import express from 'express';
import {addRoutes} from "./routes";
import cookieParser from "cookie-parser";
export const app = express();

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);
app.use(cookieParser());
addRoutes(app);

