import {Request, Response} from "express";
import {testingRepository} from "../repositories/testingRepository";

export const deleteAllController = (req: Request, res: Response) => {

    testingRepository.deleteAll();
    res.sendStatus(204);

}

