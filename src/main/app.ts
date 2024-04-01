import express from 'express';
import {addRoutes} from "./routes";
import cookieParser from "cookie-parser";
export const app = express();

app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', true);
addRoutes(app);

