import {HelperQueryTypeComment} from "../../../input-output-types/inputTypes";
import {CommentViewModelType, PaginatorCommentsType} from "../../../input-output-types/feedBacks/outputTypes";
import {ObjectId, WithId} from "mongodb";
import {CommentDocument, CommentModel} from "../../../db/mongo/comment/comment.model";
import {LikesForCommentsModel} from "../../../db/mongo/likesForComment/likesForComments.model";
import {CommentDB} from "../../../input-output-types/feedBacks/feedBacka.classes";

export class FeedBacksQueryRepository{


    async getMany(query: HelperQueryTypeComment, postId: string) {

        const byID = {postId: postId};

        const items = await CommentModel
            .find({
                ...byID,
            })
            .sort({[query.sortBy]: query.sortDirection})
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean();

        const itemsForPaginator = items.map(this.mapToOutput);
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
    async findById(id: ObjectId): Promise<CommentDocument| null> {
        return CommentModel.findOne({_id: id})
    }
    async findForOutput(id: ObjectId) {
        const foundComment = await this.findById(id);
        if (!foundComment) {
            return null;
        }
        return this.mapToOutput(foundComment);

    }
    mapToOutput(comment: WithId<CommentDB>): CommentViewModelType {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt

        }
    }

    async findLikesByUserAndComment(userId: string, id: string) {

        return LikesForCommentsModel.find().
        where('userID').equals(userId).
        where('commentID').equals(id).
        lean();

    }
}