import 'reflect-metadata';
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
import {AuthService} from "./features/auth/domain/auth-service";
import {BcryptService} from "./common/adapters/bcrypt-service";
import {BusinessService} from "./common/domain/business-service";
import {JWTService} from "./common/adapters/jwt-service";
import {AuthController} from "./features/auth/controllers/authController";
import {SecurityService} from "./features/security/domain/security-service";
import {CommentsController} from "./features/feedBacks/controllers/commentsController";
import {DevicesController} from "./features/security/controllers/devicesController";
import {SecurityQueryRepository} from "./features/security/repository/securityQueryRepository";
import {SecurityRepository} from "./features/security/repository/securityRepository";
import {TestingController} from "./features/testing/controllers/testingController";
import {TestingRepository} from "./features/testing/repositories/testingRepository";
import {Container} from "inversify";

 export const blogsRepository = new BlogsRepository();
// const blogsQueryRepository = new BlogsQueryRepository();
// const postsQueryRepository = new PostsQueryRepository();
// const postsRepository = new PostsRepository();
 export const usersQueryRepository = new UsersQueryRepository();
 export const usersRepository = new UsersRepository();

export const feedBacksRepository = new FeedBacksRepository();
// const feedBacksQueryRepository = new FeedBacksQueryRepository();
// const securityQueryRepository = new SecurityQueryRepository();
// const securityRepository = new SecurityRepository();
// const testingRepository = new TestingRepository();

 const bcryptService = new BcryptService();
// const usersService = new UsersService(usersRepository, usersQueryRepository,bcryptService);
// const postsService = new PostsService(postsRepository, postsQueryRepository, blogsRepository, blogsQueryRepository)
// const blogsService = new BlogsService(blogsRepository, blogsQueryRepository, postsRepository, postsQueryRepository);
// const feedBacksService = new FeedbacksService(feedBacksRepository, feedBacksQueryRepository, usersQueryRepository, postsRepository);
 const jwtService = new JWTService();
 const businessService = new BusinessService();

 export const authService = new AuthService(bcryptService, businessService, jwtService, usersRepository, usersQueryRepository);
// const securityService = new SecurityService(securityQueryRepository, securityRepository);
// export const blogsController = new BlogsController(blogsService, blogsQueryRepository);
// export const postsController = new PostsController(postsService, feedBacksService, feedBacksQueryRepository, postsQueryRepository)
// // export const usersController = new UsersController(usersService, usersQueryRepository)
// export const authController = new AuthController(authService, usersService, jwtService, usersQueryRepository, securityService);
// export const commentsController = new CommentsController(feedBacksService,feedBacksQueryRepository)
// export const testingController = new TestingController(testingRepository);
// export const devicesController = new DevicesController(securityService, securityQueryRepository);

export const container = new Container();
container.bind(UsersController).to(UsersController);
container.bind(UsersService).to(UsersService);
container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);

container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(PostsRepository).to(PostsRepository);
container.bind(FeedBacksRepository).to(FeedBacksRepository);
container.bind(FeedBacksQueryRepository).to(FeedBacksQueryRepository);
container.bind(SecurityQueryRepository).to(SecurityQueryRepository);
container.bind(SecurityRepository).to(SecurityRepository);
container.bind(TestingRepository).to(TestingRepository);
container.bind(BcryptService).to(BcryptService);
container.bind(PostsService).to(PostsService);
container.bind(BlogsService).to(BlogsService);
container.bind(FeedbacksService).to(FeedbacksService);
container.bind(JWTService).to(JWTService);
container.bind(BusinessService).to(BusinessService);
container.bind(AuthService).to(AuthService);
container.bind(SecurityService).to(SecurityService);
container.bind(BlogsController).to(BlogsController);
container.bind(PostsController).to(PostsController);
container.bind(AuthController).to(AuthController);
container.bind(CommentsController).to(CommentsController);
container.bind(TestingController).to(TestingController);
container.bind(DevicesController).to(DevicesController);


