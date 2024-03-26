import {SortDirection} from "mongodb";

export type ParamsType = {id:string};

export type HelperQueryTypeBlog = {
    searchNameTerm: string|null;
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirection,
}

export type HelperQueryTypePost = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirection,
}

export type HelperQueryTypeComment = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirection,
}

export type UserQueryType = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirection,
    searchLoginTerm: string|null,
    searchEmailTerm: string|null,
}