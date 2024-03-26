import {ObjectId} from "mongodb";
import {
    BlogDBMongoType,
    InsertedInfoType,
} from "../../../input-output-types/inputOutputTypesMongo";
import {blogCollection} from "../../../db/mongo-db";
import {TypeBlogViewModel} from "../../../input-output-types/blogs/outputTypes";
import {TypeBlogInputModel} from "../../../input-output-types/blogs/inputTypes";

export const blogsMongoRepository = {
    async create(input: any) {

        try {
            const insertedInfo = await blogCollection.insertOne(input);
            return insertedInfo as InsertedInfoType;
        } catch (e) {
            return undefined;
        }

    },

    async find(id: ObjectId): Promise<BlogDBMongoType | null> {
        return blogCollection.findOne({_id: id});
    },
    findForOutput: async function (id: ObjectId) {
        const foundBlog = await this.find(id);
        if (!foundBlog) {
            return null
        }
        return this.mapToOutput(foundBlog as BlogDBMongoType);
    },

    mapToOutput(blog: BlogDBMongoType): TypeBlogViewModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: false
        }
    },
    async updateBlog(id: ObjectId, input: TypeBlogInputModel) {

        await blogCollection.updateOne({_id: id}, {
            $set: {
                name: input.name,
                description: input.description,
                websiteUrl: input.websiteUrl
            }
        })

    },
    async delete(id: ObjectId) {

        await blogCollection.deleteOne({_id: id});

    },
}