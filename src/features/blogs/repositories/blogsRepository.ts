import {ObjectId} from "mongodb";
import {BlogDocument, BlogModel} from "../../../db/mongo/blog/blog.model";
import {TypeBlogInputModel} from "../types/inputTypes";
import {injectable} from "inversify";

@injectable()
export class BlogsRepository{
    async findById(id: ObjectId): Promise<BlogDocument| null> {
        return BlogModel.findOne({_id: id})
    }
    async save(blog: BlogDocument){

        const result = await blog.save();
        return result._id;
    }
    async updateBlog(blog: BlogDocument, dto: TypeBlogInputModel) {

        blog.websiteUrl = dto.websiteUrl;
        blog.name = dto.name;
        blog.description = dto.description;

        await blog.save();

    }
    async deleteBlog(id: ObjectId): Promise<boolean> {
        const res = await BlogModel.deleteOne({_id: id})
        return res.deletedCount === 1
    }
}
