import {BlogsRepository} from "./features/blogs/repositories/blogsRepository";
import {BlogsService} from "./features/blogs/domain/blogs-service";
import {BlogsController} from "./features/blogs/controllers/blogsController";
import {BlogsQueryRepository} from "./features/blogs/repositories/blogQueryRepository";

const blogsRepository = new BlogsRepository();
const blogQueryRepository = new BlogsQueryRepository();
const blogsService = new BlogsService(blogsRepository, blogQueryRepository);
export const blogsController = new BlogsController(blogsService, blogQueryRepository);
