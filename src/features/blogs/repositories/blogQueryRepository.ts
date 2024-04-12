import {ObjectId, WithId} from "mongodb";
import {
    BlogDBMongoType, PostDBMongoType,
} from "../../../input-output-types/inputOutputTypesMongo";
import {PaginatorBlogType, TypeBlogViewModel} from "../types/outputTypes";
import {PaginatorPostType, TypePostViewModel} from "../../../input-output-types/posts/outputTypes";
import {HelperQueryTypeBlog, HelperQueryTypePost} from "../../../input-output-types/inputTypes";
import {BlogDocument, BlogModel} from "../../../db/mongo/blog/blog.model";
import {PostModel} from "../../../db/mongo/post/post.model";


export class BlogsQueryRepository{

    async findById(id: ObjectId): Promise<BlogDocument| null> {
        return BlogModel.findOne({_id: id})
    }
    async findForOutput(id: ObjectId) {
        const foundBlog = await this.findById(id);
        if (!foundBlog) {
            return null
        }
        return this.mapToOutput(foundBlog as WithId<BlogDBMongoType>);
    }
    async getMany(query:HelperQueryTypePost, blogId: string)  {

        const byID = {blogId: blogId};

        const items = await PostModel
            .find({
                  ...byID,
                   // ...search
            })
            .sort({[query.sortBy]: query.sortDirection})
            .skip((query.pageNumber -1)*query.pageSize)
            .limit(query.pageSize)
            .lean();

        const itemsForPaginator = items.map(this.mapToOutputForPosts);
        const countPosts = await PostModel.countDocuments({...byID,});
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
    mapToOutput(blog: WithId<BlogDBMongoType>): TypeBlogViewModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: false
        }
    }
    mapToOutputForPosts(post: WithId<PostDBMongoType>):TypePostViewModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription||'',
            content: post.content||'',
            blogId: post.blogId||'',
            blogName: post.blogName||'',
            createdAt: post.createdAt||'',

        }
    }
    async getAllBlogs(query:HelperQueryTypeBlog) {

        const search = query.searchNameTerm? {name:{$regex: query.searchNameTerm, $options: 'i'}}: {}

        const items = await BlogModel
            .find({
                 ...search
            })
            .sort({[query.sortBy]: query.sortDirection})
            .skip((query.pageNumber -1)*query.pageSize)
            .limit(query.pageSize)
            .lean();

        const itemsForPaginator = items.map(this.mapToOutput);

        const countPosts = await BlogModel.countDocuments({...search,});

        const paginatorBlog: PaginatorBlogType =
            {
                pagesCount:	Math.ceil(countPosts/query.pageSize),
                page:	query.pageNumber,
                pageSize:	query.pageSize,
                totalCount: countPosts,
                items: itemsForPaginator
            };
        return paginatorBlog;

    }

}
