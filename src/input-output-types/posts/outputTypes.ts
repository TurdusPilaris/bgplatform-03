import {LikesInfoType, likeStatus} from "../feedBacks/feedBacka.classes";

export type TypePostViewModel = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string|undefined;
    createdAt: string;
    extendedLikesInfo: LikesInfoOutType&NewestLikeType
}

export type LikesInfoOutType = {
    dislikesCount: number,
    likesCount: number,
    myStatus: likeStatus
}
export type PaginatorPostType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: TypePostViewModel[];
}
export type NewestLikesType = {
    addedAt: string;
    userId: string,
    login: string
}
export type NewestLikeType = {
    newestLikes: NewestLikesType[]
}