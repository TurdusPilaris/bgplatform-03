import {Request, Response} from "express";
import {TestingRepository} from "../repositories/testingRepository";
import {injectable} from "inversify";
@injectable()
export class TestingController{
    constructor(
        protected testingRepository: TestingRepository
    ) {
    }
    async deleteAllController(req: Request, res: Response)  {

        await this.testingRepository.deleteAll();
        res.sendStatus(204);

    }
}