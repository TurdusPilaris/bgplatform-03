import 'reflect-metadata';
import {Request, Response} from "express";
import {UserInputModelType} from "../../../input-output-types/users/inputTypes";
import {UserViewModelType} from "../../../input-output-types/users/outputTypes";
import {UsersService} from "../domain/users-service";
import {ParamsType, UserQueryType} from "../../../input-output-types/inputTypes";
import {UsersQueryRepository} from "../repositories/userQueryRepository";
import {ObjectId} from "mongodb";
import {ResultStatus} from "../../../common/types/resultCode";
import {inject, injectable} from "inversify";
@injectable()
export class UsersController{
    constructor(
        @inject(UsersService) protected usersService:UsersService,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository) {}
    async postUserController(req: Request<UserInputModelType, any, any, any>, res: Response<UserViewModelType>) {

         const resultObject = await this.usersService.create(req.body);

        if(resultObject.status === ResultStatus.InternalServerError) {
            res.sendStatus(500);
            return;
        }
         if(resultObject.status === ResultStatus.Success) {
             res.status(201)
                 .send(resultObject.data!)
         }

    }
    async getUsersController(req: Request, res: Response) {

        const helper = (query:any) => {
            const queryHelper: UserQueryType = {

                pageNumber: query.pageNumber ? +query.pageNumber : 1,
                pageSize: query.pageSize ? +query.pageSize : 10,
                sortBy: query.sortBy ? query.sortBy : 'createdAt',
                sortDirection: query.sortDirection ? query.sortDirection : 'desc',
                searchLoginTerm: query.searchLoginTerm? query.searchLoginTerm: null,
                searchEmailTerm: query.searchEmailTerm? query.searchEmailTerm: null,

            }
            return queryHelper;
        }

        res
            .status(200)
            .send(await this.usersQueryRepository.getAllUsers(helper(req.query)));

    }
    async deleteUsersController(req: Request<ParamsType>, res: Response) {

        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(404);
        }
        const foundUser = await this.usersQueryRepository.find(new ObjectId(req.params.id))
        if (!foundUser) {
            res.sendStatus(404);
            return;
        }
        await this.usersService.deleteUser(new ObjectId(req.params.id));

        res.sendStatus(204);
        return;


    }
}