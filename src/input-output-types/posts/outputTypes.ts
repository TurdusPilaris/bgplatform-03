export type TypePostViewModel = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string|undefined;
    createdAt: string;
}

export type PaginatorPostType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: TypePostViewModel[];
}