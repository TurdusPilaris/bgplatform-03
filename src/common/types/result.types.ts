import {ResultStatus} from "./resultCode";

export type ResultObject<T = null> = {
    status: ResultStatus;
    errorField?: string;
    errorMessage?: string;
    data: T
}