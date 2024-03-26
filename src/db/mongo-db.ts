import {MongoClient} from "mongodb";
import {SETTING} from "../main/setting";
import {
    BlackListDBMongoType,
    BlogDBMongoTypeWithoutID, CommentDBMongoTypeWithoutID,
    PostDBMongoTypeWithoutID, UserAccountDBMongoType,
} from "../input-output-types/inputOutputTypesMongo";
// const MONGO_URL="mongodb+srv://drozdovaElena:WIMUTynaAxzPoowP@cluster0.qxhqyca.mongodb.net/?retryWrites=true&w=majority"

console.log("MONGO URL" + SETTING.MONGO_URL)

export const db = {
    client: new MongoClient(SETTING.MONGO_URL),

    getDBName() {
        return this.client.db((SETTING.DB_NAME))
    },
    async run() {
        try {
            console.log(SETTING.MONGO_URL)
            await this.client.connect()
            await this.getDBName().command({ping: 1});
            console.log("Connected successfully to mongo server");
        } catch (e: unknown) {
            console.log("Can't connect to mongo server")
            await this.client.close();
        }

    },
    async stop() {
        await this.client.close();
        console.log("Connect close");
    },
    async drop() {
        try {
            const collections = await this.getDBName().listCollections().toArray();

            for (const collection of collections) {
                const collectionName = collection.name
                await this.getDBName().collection(collectionName).deleteMany({});
            }
        } catch (e: unknown) {
            console.log('Error drop', e)
            await this.client.close()
        }
    }
}
// const client: MongoClient = new MongoClient(SETTING.MONGO_URL);
// export const db = client.db(SETTING.DB_NAME)
export const blogCollection = db.getDBName().collection<BlogDBMongoTypeWithoutID>(SETTING.BLOG_COLLECTION_NAME);
export const postCollection = db.getDBName().collection<PostDBMongoTypeWithoutID>(SETTING.POST_COLLECTION_NAME);
export const userCollection = db.getDBName().collection<UserAccountDBMongoType>(SETTING.USER_COLLECTION_NAME);
export const commentCollection = db.getDBName().collection<CommentDBMongoTypeWithoutID>(SETTING.COMMENT_COLLECTION_NAME);
export const blackListCollection = db.getDBName().collection<BlackListDBMongoType>(SETTING.BLACK_LIST_COLLECTION_NAME);

// export const connectionToDB = async () => {
//     try {
//         await client.connect();
//         await db.command({ping: 1});
//         return true;
//     } catch (e) {
//         console.log(e);
//         await client.close()
//         return false
//     }
// }
