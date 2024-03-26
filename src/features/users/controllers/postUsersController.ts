import { Request, Response} from "express";

import {UserInputModelType} from "../../../input-output-types/users/inputTypes";
import {UserViewModelType} from "../../../input-output-types/users/outputTypes";
import {usersService} from "../domain/users-service";
import {InsertedInfoType} from "../../../input-output-types/inputOutputTypesMongo";

export const postUserController = async (req: Request<UserInputModelType, any, any, any>, res: Response<UserViewModelType>) => {

    const insertedInfo: InsertedInfoType |undefined = await usersService.create(req.body);

    if(insertedInfo){
        const newUser = await  usersService.findForOutput(insertedInfo.insertedId);
        res
            .status(201)
            .send(newUser);
    }



}