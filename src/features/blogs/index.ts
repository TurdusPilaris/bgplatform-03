import {Router} from "express";
import {
    authMiddleware, authMiddlewareBearer, getUserIdWithoutAuth,
    inputValidationMiddleware,
    inputValidationMiddlewareBlogID,
    postInputValidatorBlog,
    postInputValidatorBlogID,
    postInputValidatorPostWithoutBlogID,
} from "../../middlewares/input-validation-middleware";

import {container} from "../../composition-root";
import {BlogsController} from "./controllers/blogsController";

const blogsController = container.resolve(BlogsController)
export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogsController.bind(blogsController));
blogsRouter.get('/:id', blogsController.getBlogsControllerByID.bind(blogsController));
blogsRouter.post('/', authMiddleware, postInputValidatorBlog, inputValidationMiddleware, blogsController.postBlogsController.bind(blogsController));
blogsRouter.put('/:id', authMiddleware, postInputValidatorBlog, inputValidationMiddleware, blogsController.putBlogsController.bind(blogsController));
blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlogsController.bind(blogsController));
blogsRouter.get('/:blogId/posts', getUserIdWithoutAuth, postInputValidatorBlogID, inputValidationMiddlewareBlogID, blogsController.getPostsForBlogID.bind(blogsController));
blogsRouter.post('/:blogId/posts', authMiddleware, postInputValidatorPostWithoutBlogID, inputValidationMiddleware, blogsController.postPostsForBlogsController.bind(blogsController));
