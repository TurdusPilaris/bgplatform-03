import {
    blackListCollection,
    blogCollection,
    commentCollection,
    postCollection,
    userCollection
} from "../../../db/mongo-db";

export const testingRepository ={


    deleteAll: async function () {
        await postCollection.deleteMany({});
        await blogCollection.deleteMany({});
        await userCollection.deleteMany({});
        await commentCollection.deleteMany({});
        await blackListCollection.deleteMany({});

    }
}