import {commentCollection} from "../../../db/mongo/mongo-db";
import {
    CommentDBMongoType,
    CommentDBMongoTypeWithoutID,
    InsertedInfoType
} from "../../../input-output-types/inputOutputTypesMongo";
import {ObjectId} from "mongodb";
import {CommentInputModelType} from "../../../input-output-types/comments/inputTypes";

export const commentMongoRepository = {

    async create(input: CommentDBMongoTypeWithoutID) {
        console.log('create ')
        try {
            const insertedInfo = await commentCollection.insertOne(input);
            return insertedInfo as InsertedInfoType;
        } catch (e) {

            return undefined;
        }
    },
    async find(id: ObjectId) {

        return await commentCollection.findOne({_id: id}) as CommentDBMongoType;

    },
    async deleteComment(id: ObjectId) {

        await commentCollection.deleteOne({_id: id});

    },
    async updateComment(id: ObjectId, input: CommentInputModelType) {

        await commentCollection.updateOne({_id: id}, {
            $set: {
                content: input.content
            }
        })

    }
}