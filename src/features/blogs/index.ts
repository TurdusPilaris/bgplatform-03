import {Router} from "express";
import {
    authMiddleware,
    inputValidationMiddleware,
    inputValidationMiddlewareBlogID,
    postInputValidatorBlog,
    postInputValidatorBlogID,
    postInputValidatorPostWithoutBlogID,
} from "../../middlewares/input-validation-middleware";

import {BlogsController} from "./controllers/blogsController";
export const blogsRouter = Router();
export const blogController = new BlogsController();

blogsRouter.get('/', blogController.getBlogsController);
blogsRouter.get('/:id', blogController.getBlogsControllerByID);
blogsRouter.post('/', authMiddleware, postInputValidatorBlog, inputValidationMiddleware, blogController.postBlogsController);
blogsRouter.put('/:id', authMiddleware, postInputValidatorBlog, inputValidationMiddleware, blogController.putBlogsController);
blogsRouter.delete('/:id', authMiddleware, blogController.deleteBlogsController);
blogsRouter.get('/:blogId/posts', postInputValidatorBlogID, inputValidationMiddlewareBlogID, blogController.getPostsForBlogID);
blogsRouter.post('/:blogId/posts', authMiddleware, postInputValidatorPostWithoutBlogID, inputValidationMiddleware, blogController.postPostsForBlogsController);
