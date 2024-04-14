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

export class FeedBacksQueryRepository{

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
        const likesForComments = await this.getLikesForComments(postId);

        // console.log("likesForComments ", likesForComments);
        const itemsForPaginator = comments.map((comment) => this.mapToOutput(comment,null));
        // const itemsForPaginator = comments.map(el )
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

    async findById(id: ObjectId): Promise<CommentDocument | null> {
        return CommentModel.findOne({_id: id})
    }

    async findForOutput(id: ObjectId) {
        const foundComment = await this.findById(id);
        if (!foundComment) {
            return null;
        }
        return this.mapToOutput(foundComment, null);

    }

    async getLikesInfo(commentId: string, userId: string | null): Promise<LikesInfoType> {

        let myStatus = likeStatus.None;
        if (userId) {
            const myLikeForComment = await LikesForCommentsModel.findOne({commentID: commentId, userID: userId}).lean();
            if (!myLikeForComment) {
                myStatus = likeStatus.None
            } else {
                myStatus = myLikeForComment.statusLike
            }
        }

        return {
            likesCount: await LikesForCommentsModel.countDocuments({commentID: commentId, statusLike: likeStatus.Like}),
            dislikesCount: await LikesForCommentsModel.countDocuments({
                commentID: commentId,
                statusLike: likeStatus.Dislike
            }),
            myStatus: myStatus
        }


    }

    async findCommentWithLikesForOutput(id: ObjectId, userId: string | null) {
        const foundComment = await this.findById(id);
        if (!foundComment) {
            return null;
        }

        const likesInfo = await this.getLikesInfo(id.toString(), userId)
        return this.mapToOutput(foundComment,
            likesInfo);

    }

    mapToOutput(comment: WithId<CommentDB>, likes: LikesInfoType | null): CommentViewModelType {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
            likesInfo: likes
        }
    }

    async findLikesByUserAndComment(userId: string, id: string) {

        return LikesForCommentsModel.find().where('userID').equals(userId).where('commentID').equals(id).lean();

    }

    private async getLikesForComments(postId: string) {
        // const likes = LikesForCommentsModel.find().where('commentId').in(commentsIds)
        // const likes = await LikesForCommentsModel.aggregate([{
        //     $group: {
        //         _id: {
        //             commentID: "$commentID",
        //             statusLike: "$statusLike"
        //         },
        //         count: {$sum: 1}
        //     },
        //     $project: {
        //         // _id: 0,
        //         commentID: "$_id.commentID",
        //         statusLike: "$_id.statusLike",
        //         count: 1
        //     }
        // }])
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
        const likes = await CommentModel.aggregate([
            {$match: {postId:postId}},
            // {$addFields: {id:'$_id'}}
            {
                $lookup: {
                    localField: '_id',
                    from: 'likesforcomments',
                    foreignField: 'commentID',
                    as: 'likesInfo.likes',
                },
            },
            {
                $addFields: {
                    'likesInfo.countLikes': {
                        $size: {
                            $filter:{
                               input: '$likesInfo.likes',
                               cond: {$eq: ['$$this.statusLike', 'Like']},
                            } ,
                        },
                    },
                },
            },
            {
                $addFields: {
                    'likesInfo.countDislikes': {
                        $size: {
                            $filter:{
                                input: '$likesInfo.likes',
                                cond: {$eq: ['$$this.statusLike', 'Dislike']},
                            } ,
                        },
                    },
                },
            },
        ])
        console.log("likes", likes);
        return likes;
        // const likesMap = likes.reduce((acc, like) => {
        //    acc[like.commentID] = like;
        //
        //    return acc
        // },{} as Record<string, LikesInfoCommentIDType>)


    }
    }