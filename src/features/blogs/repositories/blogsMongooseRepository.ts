import {ObjectId, WithId} from "mongodb";
import {BlogDBMongoType} from "../../../input-output-types/inputOutputTypesMongo";
import {BlogDocument, BlogModel} from "../../../db/mongo/blog/blog.model";
import {TypeBlogInputModel} from "../types/inputTypes";
import {blogCollection} from "../../../db/mongo/mongo-db";
import {TypeBlogViewModel} from "../types/outputTypes";

export const blogsMongooseRepository = {
    async findById(id: ObjectId): Promise<BlogDocument| null> {
        return BlogModel.findOne({_id: id})
    },
    async save(blog: BlogDocument){

       const result = await blog.save();
       return result._id;
    },
    async updateBlog(blog: BlogDocument, dto: TypeBlogInputModel) {

        blog.websiteUrl = dto.websiteUrl;
        blog.name = dto.name;
        blog.description = dto.description;

        await blog.save();

    },
    findForOutput: async function (id: ObjectId) {
        const foundBlog = await this.findById(id);
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
}