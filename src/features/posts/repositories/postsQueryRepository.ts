import {
    PostDBMongoType,
} from "../../../input-output-types/inputOutputTypesMongo";
import {ObjectId, WithId} from "mongodb";
import {PaginatorPostType, TypePostViewModel} from "../../../input-output-types/posts/outputTypes";
import {HelperQueryTypePost} from "../../../input-output-types/inputTypes";
import {NewestLikesType, PostDBType, PostDocument, PostModel} from "../domain/postModel";
import {injectable} from "inversify";
import {FeedBacksQueryRepository} from "../../feedBacks/reepositories/feedBackQueryRepository";
import {likeStatus} from "../../../input-output-types/feedBacks/feedBacka.classes";

@injectable()
export class PostsQueryRepository {

    constructor(protected feedBacksQueryRepository: FeedBacksQueryRepository) {
    }

    async findById(id: ObjectId): Promise<PostDocument | null> {
        return PostModel.findOne({_id: id})
    }

    async findForOutput(id: ObjectId, userId: string | null) {

        const foundPost = await this.findById(id);
        if (!foundPost) {
            return null
        }
        const myLike = await this.feedBacksQueryRepository.getLikesInfo(id.toString(), userId)

        return this.mapToOutput(foundPost, myLike);
    }

    mapToOutput(post: PostDBType, myLikes?: likeStatus): TypePostViewModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription || '',
            content: post.content || '',
            blogId: post.blogId || '',
            blogName: post.blogName || '',
            createdAt: post.createdAt.toISOString() || '',
            extendedLikesInfo: {
                dislikesCount: (!post.likesInfo.countDislikes) ? 0 : post.likesInfo.countDislikes,
                likesCount: (!post.likesInfo.countLikes)? 0 : post.likesInfo.countLikes,
                myStatus: (!myLikes) ? post.likesInfo.myStatus : myLikes,
                newestLikes: post.likesInfo.newestLikes.map(function (newestLikes)  {
                    return {userId: newestLikes.userId,
                        addedAt: newestLikes.addedAt.toISOString(),
                        login: newestLikes.login}

                })
            }

        }
    }

    async getAllPosts(query: HelperQueryTypePost, userId: string | null, blogId?: string) {

        let filter =  {}
        if (blogId) {
            filter = {blogId: blogId};
        }
        const posts = await PostModel
            .find(filter)
            .sort({[query.sortBy]: query.sortDirection})
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean();

        const postIds = posts.map((post) => post._id.toString());

        const myStatusesForPosts = await this.feedBacksQueryRepository.getLikesByUser(postIds, userId);
        console.log("myStatusesForPosts", myStatusesForPosts)
        const itemsForPaginator = posts.map((post) => this.mapToOutput(post,
            myStatusesForPosts[post._id.toString()]?.statusLike));


        const countPosts = await PostModel.countDocuments(filter);
        const paginatorPost: PaginatorPostType =
            {
                pagesCount: Math.ceil(countPosts / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countPosts,
                items: itemsForPaginator
            };
        return paginatorPost;

    }

}