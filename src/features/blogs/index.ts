import {Router} from "express";
import {getBlogsController} from "./controllers/getBlogsController";
import {deleteBlogsController} from "./controllers/deleteBlogsController";
import {
    authMiddleware,
    inputValidationMiddleware,
    inputValidationMiddlewareBlogID,
    postInputValidatorBlog,
    postInputValidatorBlogID,
    postInputValidatorPostWithoutBlogID,
} from "../../middlewares/input-validation-middleware";
import {getBlogsControllerByID} from "./controllers/getBlogsControllerByID";
import {postBlogsController} from "./controllers/postBlogsController";
import {putBlogsController} from "./controllers/putBlogsController";
import {getPostsForBlogID} from "./controllers/getPostsForBlogIDController";
import {postPostsForBlogsController} from "./controllers/postPostsForBlogsController";


export const blogsRouter = Router();

blogsRouter.get('/', getBlogsController);
blogsRouter.get('/:id', getBlogsControllerByID);
blogsRouter.post('/', authMiddleware, postInputValidatorBlog, inputValidationMiddleware, postBlogsController);
blogsRouter.put('/:id', authMiddleware, postInputValidatorBlog, inputValidationMiddleware, putBlogsController);
blogsRouter.delete('/:id', authMiddleware, deleteBlogsController);
blogsRouter.get('/:blogId/posts', postInputValidatorBlogID, inputValidationMiddlewareBlogID, getPostsForBlogID);
blogsRouter.post('/:blogId/posts', authMiddleware, postInputValidatorPostWithoutBlogID, inputValidationMiddleware, postPostsForBlogsController);
