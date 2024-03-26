import {TypePostViewModel} from "../posts/outputTypes";

export type UserViewModelType = {
    id: string;
    login: string;
    email: string;
    createdAt: string;

}

export type PaginatorUserType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UserViewModelType[];
}

export type MeViewModelType = {
    email: string;
    login: string;
    userId: string;
}
