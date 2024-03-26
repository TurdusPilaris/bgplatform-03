import {Request, Response} from "express";
import {userQueryRepository} from "../../users/repositories/userQueryRepository";
import {MeViewModelType} from "../../../input-output-types/users/outputTypes";
import {ResultStatus} from "../../../common/types/resultCode";

export const getInformationMe = async (req: Request, res: Response<MeViewModelType>) => {

    const result = await userQueryRepository.getAboutMe(req.userId);

    if (result.status === ResultStatus.BadRequest) { res.sendStatus(400)}

    if(result.status === ResultStatus.Success) { res.status(200).send(result.data!)}

}