import {
    PostDBMongoType,
} from "../../../input-output-types/inputOutputTypesMongo";
import { postCollection} from "../../../db/mongo/mongo-db";
import {ObjectId} from "mongodb";
import {PaginatorPostType, TypePostViewModel} from "../../../input-output-types/posts/outputTypes";
import {HelperQueryTypePost} from "../../../input-output-types/inputTypes";
import {postsMongoRepository} from "./postMongoRepository";

export const postQueryRepository ={

    async findForOutput(id: ObjectId) {
       return  await postsMongoRepository.findForOutput(id);
    },
    mapToOutput(post: PostDBMongoType):TypePostViewModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription||'',
            content: post.content||'',
            blogId: post.blogId||'',
            blogName: post.blogName||'',
            createdAt: post.createdAt||'',

        }
    },
    getAllPosts: async function (query:HelperQueryTypePost) {

        const items = await postCollection
            .find({})
            .sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber -1)*query.pageSize)
            .limit(query.pageSize)
            .toArray();

        const itemsForPaginator = items.map(this.mapToOutput);
        const countPosts = await postCollection.countDocuments({});
        const paginatorPost: PaginatorPostType =
            {
                pagesCount:	Math.ceil(countPosts/query.pageSize),
                page:	query.pageNumber,
                pageSize:	query.pageSize,
                totalCount: countPosts,
                items: itemsForPaginator
            };
        return paginatorPost;


    },

}