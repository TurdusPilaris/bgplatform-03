import {HelperQueryTypeComment} from "../../../input-output-types/inputTypes";
import {
    CommentViewModelType, LikesInfoCommentIDType,
    LikesInfoType,
    PaginatorCommentsType
} from "../../../input-output-types/feedBacks/outputTypes";
import {ObjectId, WithId} from "mongodb";
import {CommentDocument, CommentModel} from "../../../db/mongo/comment/comment.model";
import {
    LikesForCommentsDocument,
    LikesForCommentsModel
} from "../../../db/mongo/likesForComment/likesForComments.model";
import {CommentDB, LikesForCommentsType, likeStatus} from "../../../input-output-types/feedBacks/feedBacka.classes";

export class FeedBacksQueryRepository {

    async getMany(query: HelperQueryTypeComment, postId: string, userId: string | null) {

        const byID = {postId: postId};

        const comments = await CommentModel
            .find({
                ...byID,
            })
            .sort({[query.sortBy]: query.sortDirection})
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean();

        const commentsIds = comments.map((comments) => comments._id.toString());
        // const likesForComments = await this.getLikesForComments(postId, userId, query);
        const myStatusesForComments = await this.getLikesByUser(commentsIds, userId);
        // const itemsForPaginator = likesForComments.map(this.mapToOutputForCommentsWithPost);
        const itemsForPaginator = comments.map((comment) => this.mapToOutput(comment,
            myStatusesForComments[comment._id.toString()]?.statusLike));
        const countComments = await CommentModel.countDocuments({...byID,});
        const paginatorComments: PaginatorCommentsType =
            {
                pagesCount: Math.ceil(countComments / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countComments,
                items: itemsForPaginator
            };
        return paginatorComments;
    }

    async findCommentById(id: ObjectId): Promise<CommentDocument | null> {
        return CommentModel.findOne({_id: id})
    }

    async findForOutput(id: ObjectId) {
        const foundComment = await this.findCommentById(id);
        if (!foundComment) {
            return null;
        }
        return this.mapToOutput(foundComment, undefined);

    }

    async getLikesInfo(commentId: string, userId: string | null): Promise<likeStatus> {

        if (userId) {
            const myLikeForComment = await LikesForCommentsModel.findOne({commentID: commentId, userID: userId}).lean();
            if (!myLikeForComment) {
                return likeStatus.None
            } else {
                return myLikeForComment.statusLike
            }
        } else {
            return likeStatus.None
        }
    }

    async findCommentWithLikesForOutput(id: ObjectId, userId: string | null) {
        const foundComment = await this.findCommentById(id);
        if (!foundComment) {
            return null;
        }

        const myLike = await this.getLikesInfo(id.toString(), userId)
        return this.mapToOutput(foundComment,
            myLike);

    }

    mapToOutput(comment: WithId<CommentDB>, myLikes?: likeStatus): CommentViewModelType {

        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            // createdAt: comment.createdAt.toISOString(),
            createdAt: comment.createdAt.toISOString(),
            likesInfo: {
                dislikesCount: comment.likesInfo.countDislikes,
                likesCount: comment.likesInfo.countLikes,
                myStatus: (!myLikes) ? comment.likesInfo.myStatus : myLikes
            }

        }
    }

    private async getLikesForComments(postId: string, userID: string | null, query: HelperQueryTypeComment) {
        // const likes = LikesForCommentsModel.find().where('commentId').in(commentsIds)
        // const likes = await LikesForCommentsModel.aggregate([
        //     {
        //         $group: {
        //             _id: {
        //                 commentID: "$commentID",
        //                 statusLike: "$statusLike"
        //             },
        //             count: { $sum: 1 }
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             commentID: "$_id.commentID",
        //             statusLike: "$_id.statusLike",
        //             count: 1
        //         }
        //     }
        // ]);


        // const likes = await CommentModel.aggregate([
        //     {$match: {postId:postId}},
        //     // {$addFields: {id:'$_id'}}
        //     {
        //         $lookup: {
        //             localField: '_id',
        //             from: 'likesforcomments',
        //             foreignField: 'commentID',
        //             as: 'likesInfo.likes',
        //         },
        //     },
        //     {
        //         $addFields: {
        //             'likesInfo.countLikes': {
        //                 $size: {
        //                     $filter:{
        //                        input: '$likesInfo.likes',
        //                        cond: {$eq: ['$$this.statusLike', 'Like']},
        //                     } ,
        //                 },
        //             },
        //         },
        //     },
        //     {
        //         $addFields: {
        //             'likesInfo.countDislikes': {
        //                 $size: {
        //                     $filter:{
        //                         input: '$likesInfo.likes',
        //                         cond: {$eq: ['$$this.statusLike', 'Dislike']},
        //                     } ,
        //                 },
        //             },
        //         },
        //     },
        //     {
        //         $addFields: {
        //             'likesInfo.myStatus': {
        //                 $first : {
        //                     $filter:{
        //                         input: '$likesInfo.likes',
        //                         cond:  [{$eq:['$$this.userID', userID]},
        //                         '$statusLike']
        //                     } ,
        //                   },
        //             },
        //         },
        //     },
        //
        // ])
        //     // @ts-ignore
        //     .sort({[query.sortBy]: query.sortDirection})
        //     .skip((query.pageNumber - 1) * query.pageSize)
        //     .limit(query.pageSize)
        //
        // return likes;
    }

    private async getLikesByUser(commentsIds: any, userId: string | null) {

        // if(!userId) return []
        const likes = await LikesForCommentsModel.find().where('commentID').in(commentsIds).where('userID').equals(userId).lean();

        const likesWithKeys = likes.reduce((acc, like) => {

            const likecommentID = like.commentID.toString();

            acc[likecommentID] = like
            return acc
        }, {} as Record<string, WithId<LikesForCommentsType>>)

        return likesWithKeys;
    }
}