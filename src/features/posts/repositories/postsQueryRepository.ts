import {
    PostDBMongoType,
} from "../../../input-output-types/inputOutputTypesMongo";
import {ObjectId, WithId} from "mongodb";
import {PaginatorPostType, TypePostViewModel} from "../../../input-output-types/posts/outputTypes";
import {HelperQueryTypePost} from "../../../input-output-types/inputTypes";
import {PostDBType, PostDocument, PostModel} from "../domain/postModel";
import {injectable} from "inversify";
@injectable()
export class PostsQueryRepository {

    async findById(id: ObjectId): Promise<PostDocument| null> {
        return PostModel.findOne({_id: id})
    }
    async findForOutput(id: ObjectId) {

        const foundPost =  await this.findById(id);
        if(!foundPost) {return null}
        return this.mapToOutput(foundPost);
    }
    mapToOutput(post: PostDBType):TypePostViewModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription||'',
            content: post.content||'',
            blogId: post.blogId||'',
            blogName: post.blogName||'',
            createdAt: post.createdAt.toISOString()||'',

        }
    }
    async getAllPosts(query:HelperQueryTypePost) {

       const items = await PostModel
            .find({})
            .sort({[query.sortBy]: query.sortDirection})
            .skip((query.pageNumber -1)*query.pageSize)
            .limit(query.pageSize)
            .lean();

        const itemsForPaginator = items.map(this.mapToOutput);

        const countPosts = await PostModel.countDocuments({});
        const paginatorPost: PaginatorPostType =
            {
                pagesCount:	Math.ceil(countPosts/query.pageSize),
                page:	query.pageNumber,
                pageSize:	query.pageSize,
                totalCount: countPosts,
                items: itemsForPaginator
            };
        return paginatorPost;

    }

}