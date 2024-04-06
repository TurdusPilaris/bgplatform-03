import {HelperQueryTypeComment} from "../../../input-output-types/inputTypes";
import {commentCollection} from "../../../db/mongo/mongo-db";
import {CommentViewModelType, PaginatorCommentsType} from "../../../input-output-types/comments/outputTypes";
import {ObjectId} from "mongodb";
import {CommentDBMongoType} from "../../../input-output-types/inputOutputTypesMongo";

export const commentQueryRepository = {

    async getMany(query: HelperQueryTypeComment, postId: string) {

        const byID = {postId: postId};

        const items = await commentCollection
            .find({
                ...byID,
            })
            .sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray();

        const itemsForPaginator = items.map(this.mapToOutput);
        const countComments = await commentCollection.countDocuments({...byID,});
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
    async find(id: ObjectId) {

        return await commentCollection.findOne({_id: id}) as CommentDBMongoType;

    },
    async findForOutput(id: ObjectId) {
        const foundComment = await this.find(id);
        if (!foundComment) {
            return undefined
        }
        return this.mapToOutput(foundComment);
    },
    mapToOutput(comment: CommentDBMongoType): CommentViewModelType {
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