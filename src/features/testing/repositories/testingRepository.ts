import {
    blackListCollection,
    blogCollection,
    commentCollection,
    postCollection,
    userCollection
} from "../../../db/mongo/mongo-db";
import {PostModel} from "../../../db/mongo/post/post.model";
import {BlogModel} from "../../../db/mongo/blog/blog.model";

export const testingRepository ={


    deleteAll: async function () {
        await PostModel.deleteMany({});
        await BlogModel.deleteMany({});
        // await postCollection.deleteMany({});
        // await blogCollection.deleteMany({});
        await userCollection.deleteMany({});
        await commentCollection.deleteMany({});
        await blackListCollection.deleteMany({});

    }
}