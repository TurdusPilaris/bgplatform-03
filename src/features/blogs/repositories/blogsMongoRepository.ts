import {ObjectId, WithId} from "mongodb";
import {
    BlogDBMongoType,
    InsertedInfoType,
} from "../../../input-output-types/inputOutputTypesMongo";
import {blogCollection} from "../../../db/mongo/mongo-db";
import {TypeBlogViewModel} from "../types/outputTypes";
import {TypeBlogInputModel} from "../types/inputTypes";
import {BlogModel} from "../../../db/mongo/blog/blog.model";

export const blogsMongoRepository = {
    async create(input: WithId<BlogDBMongoType>) {

        try {
            const insertedInfo = await blogCollection.insertOne(input);
            return insertedInfo as InsertedInfoType;
        } catch (e) {
            return undefined;
        }

    },

    async find(id: ObjectId): Promise<WithId<BlogDBMongoType> | null> {
        return blogCollection.findOne({_id: id});
    },
    findForOutput: async function (id: ObjectId) {
        const foundBlog = await this.find(id);

        if (!foundBlog) {
            return null
        }
        return this.mapToOutput(foundBlog as WithId<BlogDBMongoType>);
    },

    mapToOutput(blog: WithId<BlogDBMongoType>): TypeBlogViewModel {
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

    /////////MONGOOSE
    async findById(id: string): Promise<WithId<BlogDBMongoType> | null> {
        return  BlogModel.findOne({_id: id})
    },
}