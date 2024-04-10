import {Request, Response} from "express";
import {UserInputModelType} from "../../../input-output-types/users/inputTypes";
import {UserViewModelType} from "../../../input-output-types/users/outputTypes";
import {InsertedInfoType} from "../../../input-output-types/inputOutputTypesMongo";
import {usersService} from "../domain/users-service";
import {ParamsType, UserQueryType} from "../../../input-output-types/inputTypes";
import {userQueryRepository} from "../repositories/userQueryRepository";
import {ObjectId} from "mongodb";

export class UsersController{
    async postUserController(req: Request<UserInputModelType, any, any, any>, res: Response<UserViewModelType>) {

        const insertedInfo: InsertedInfoType |undefined = await usersService.create(req.body);

        if(insertedInfo){
            const newUser = await  usersService.findForOutput(insertedInfo.insertedId);
            res
                .status(201)
                .send(newUser);
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
            .send(await userQueryRepository.getAllUsers(helper(req.query)));

    }
    async deleteUsersController(req: Request<ParamsType>, res: Response) {

        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(404);
        }
        const foundUser = await usersService.find(new ObjectId(req.params.id))
        if (!foundUser) {
            res.sendStatus(404);
            return;
        }
        await usersService.deleteUser(new ObjectId(req.params.id));

        res.sendStatus(204);
        return;


    }
}