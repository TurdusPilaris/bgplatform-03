import {
    InsertedInfoType,
    PostDBMongoType, PostDBMongoTypeWithoutID,
} from "../../../input-output-types/inputOutputTypesMongo";
import {blogsMongoRepository} from "../../blogs/repositories/blogsMongoRepository";
import {postCollection} from "../../../db/mongo/mongo-db";
import {ObjectId} from "mongodb";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {TypePostViewModel} from "../../../input-output-types/posts/outputTypes";

export const postsMongoRepository ={
    async create(input: PostDBMongoTypeWithoutID) {

        try {
            const insertedInfo = await postCollection.insertOne(input);
            return insertedInfo as InsertedInfoType;
        } catch (e) {
            return undefined;
        }


    },
    async find(id: ObjectId) {

        return (await postCollection.findOne({_id: id})) as PostDBMongoType;

    },
    async findForOutput(id: ObjectId) {
        const foundPost =  await this.find(id);
        if(!foundPost) {return undefined}
        return this.mapToOutput(foundPost);
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

    async deletePost(id: ObjectId) {

        await postCollection.deleteOne({_id: id});

    },
    async updatePost(id: ObjectId, input: TypePostInputModelModel) {

       let foundedBlog = await blogsMongoRepository.find(new ObjectId(input.blogId));

       await postCollection.updateOne({_id: id}, {
           $set: {
               title: input.title,
               shortDescription: input.shortDescription,
               content: input.content,
               // blogId: input.blogId??blogId,
               blogId: foundedBlog?._id.toString(),
               blogName: foundedBlog?.name
           }
       })

    }

}