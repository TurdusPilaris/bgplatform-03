import {TypePostViewModel} from "../posts/outputTypes";

export type CommentViewModelType = {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfoType,
    createdAt: string
}

export type CommentatorInfoType = {
    userId: string,
    userLogin: string
}

export type PaginatorCommentsType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentViewModelType[];
}