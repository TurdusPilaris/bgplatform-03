import {MongoClient, WithId} from "mongodb";
import {SETTING} from "../../main/setting";
import {
    BlogDBMongoType,
    PostDBMongoType,
    UserAccountDBType,
} from "../../input-output-types/inputOutputTypesMongo";
import {CustomRateLimitType, DeviceAuthSessionsType} from "../../input-output-types/common/common-types";
import mongoose from "mongoose";
import {BlogModel} from "./blog/blog.model";
import {PostModel} from "../../features/posts/domain/postModel";
import {CommentDB} from "../../features/feedBacks/domain/commentModel";

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
            // await this.client.connect()
            //переходим на мангус

            await mongoose.connect(SETTING.MONGO_URL)
            await this.getDBName().command({ping: 1});
            console.log("Connected successfully to mongo server");
        } catch (e: unknown) {
            console.log("Can't connect to mongo server")
            // await this.client.close();
            await mongoose.disconnect()
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

            await BlogModel.deleteMany({});
            await PostModel.deleteMany({});
        } catch (e: unknown) {
            console.log('Error drop', e)
            await this.client.close()
        }
    }
}
// const client: MongoClient = new MongoClient(SETTING.MONGO_URL);
// export const db = client.db(SETTING.DB_NAME)
export const blogCollection = db.getDBName().collection<WithId<BlogDBMongoType>>(SETTING.BLOG_COLLECTION_NAME);
export const postCollection = db.getDBName().collection<WithId<PostDBMongoType>>(SETTING.POST_COLLECTION_NAME);
export const userCollection = db.getDBName().collection<WithId<UserAccountDBType>>(SETTING.USER_COLLECTION_NAME);
export const commentCollection = db.getDBName().collection<WithId<CommentDB>>(SETTING.COMMENT_COLLECTION_NAME);
export const customRateLimit  = db.getDBName().collection<CustomRateLimitType>(SETTING.CUSTOM_RATE_LIMIT_COLLECTION_NAME);
export const deviceAuthSessions = db.getDBName().collection<DeviceAuthSessionsType>(SETTING.DEVICE_AUTH_SESSION_COLLECTION_NAME);

