import { Request, Response} from "express";
import {ObjectId} from "mongodb";
import {ParamsType} from "../../../input-output-types/inputTypes";
import {usersService} from "../domain/users-service";

export const deleteUsersController = async (req: Request<ParamsType>, res: Response) => {

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