import {HelperQueryTypeComment} from "../../../input-output-types/inputTypes";
import {commentCollection} from "../../../db/mongo/mongo-db";
import {CommentViewModelType, PaginatorCommentsType} from "../../../input-output-types/comments/outputTypes";
import {ObjectId, WithId} from "mongodb";
import {CommentDBType} from "../../../input-output-types/inputOutputTypesMongo";
import {feedBacksRepository} from "./feedBacksRepository";
import {CommentModel} from "../../../db/mongo/comment/comment.model";

export const commentQueryRepository = {

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

        const itemsForPaginator = items.map(commentQueryRepository.mapToOutput);
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
    },
    async findForOutput(id: ObjectId) {
        const foundComment = await feedBacksRepository.findById(id);
        if (!foundComment) {
            return null;
        }
        return this.mapToOutput(foundComment);

    },
    mapToOutput(comment: WithId<CommentDBType>): CommentViewModelType {
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
}