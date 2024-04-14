export type CommentViewModelType = {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfoType,
    createdAt: string,
    likesInfo: LikesInfoType|null
}

export type LikesInfoType = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
}

export type LikesInfoCommentIDType = {
    commentID: string,
    likesCount: number,
    dislikesCount: number,
    myStatus: string
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