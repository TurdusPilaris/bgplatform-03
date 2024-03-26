import {TypePostViewModel} from "../posts/outputTypes";

export type TypeBlogViewModel = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}

export type PaginatorBlogType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: TypeBlogViewModel[];
}