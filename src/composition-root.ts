import {BlogsRepository} from "./features/blogs/repositories/blogsRepository";
import {BlogsService} from "./features/blogs/domain/blogs-service";
import {BlogsController} from "./features/blogs/controllers/blogsController";
import {BlogsQueryRepository} from "./features/blogs/repositories/blogQueryRepository";
import {PostsQueryRepository} from "./features/posts/repositories/postsQueryRepository";
import {PostsService} from "./features/posts/domain/posts-service";
import {PostsRepository} from "./features/posts/repositories/postsRepository";
import {FeedbacksService} from "./features/feedBacks/domain/feedbacks-service";
import {UsersQueryRepository} from "./features/users/repositories/userQueryRepository";
import {FeedBacksRepository} from "./features/feedBacks/reepositories/feedBacksRepository";
import {FeedBacksQueryRepository} from "./features/feedBacks/reepositories/feedBackQueryRepository";
import {PostsController} from "./features/posts/controllers/postsController";
import {UsersService} from "./features/users/domain/users-service";
import {UsersRepository} from "./features/users/repositories/usersRepository";
import {UsersController} from "./features/users/controllers/usersController";

export const blogsRepository = new BlogsRepository();
const blogsQueryRepository = new BlogsQueryRepository();
const postsQueryRepository = new PostsQueryRepository();
const postsRepository = new PostsRepository();
export const usersQueryRepository = new UsersQueryRepository();
const usersRepository = new UsersRepository();

const feedBacksRepository = new FeedBacksRepository();
const feedBacksQueryRepository = new FeedBacksQueryRepository();

const usersService = new UsersService(usersRepository, usersQueryRepository);
const postsService = new PostsService(postsRepository, postsQueryRepository, blogsRepository, blogsQueryRepository)
const blogsService = new BlogsService(blogsRepository, blogsQueryRepository, postsRepository, postsQueryRepository);
const feedBackService = new FeedbacksService(feedBacksRepository, feedBacksQueryRepository, usersQueryRepository, postsRepository);
export const blogsController = new BlogsController(blogsService, blogsQueryRepository);
export const postsController = new PostsController(postsService, feedBackService, feedBacksQueryRepository, postsQueryRepository)
export const usersController = new UsersController(usersService, usersQueryRepository)