// import {ResultObject} from "../types/result.types";
// import {Response} from "express";
// import {ResultStatus} from "../types/resultCode";
//
// export const errorHandler = (result: ResultObject, res: Response) => {
//     if(result.status === ResultStatus.NotFound) return res.status(404).send(result.errorMessage);
//     if(result.status === ResultStatus.Forbidden) return res.status(403).send(result.errorMessage);
// }