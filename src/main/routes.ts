import {Express} from "express";
import {testingRouter} from "../features/testing";
import {postsRouter} from "../features/posts";
import {blogsRouter} from "../features/blogs";
import {Request, Response} from "express";
import {usersRouter} from "../features/users";
import {authRouter} from "../features/auth/auth-router";
import {SETTING} from "./setting";
import {feedbackRouter} from "../features/feedBacks/feedbackRouter";



export const addRoutes = (app: Express) => {
    app.use(SETTING.PATH_TESTING, testingRouter);
    app.use(SETTING.PATH_POSTS, postsRouter);
    app.use(SETTING.PATH_BLOGS, blogsRouter);
    app.use(SETTING.PATH_USERS, usersRouter);
    app.use(SETTING.PATH_AUTH, authRouter);
    app.use(SETTING.PATH_COMMENT, feedbackRouter);
    app.get('/', (req: Request, res: Response) => {
        res.send('Hello Samurai')
    });


}