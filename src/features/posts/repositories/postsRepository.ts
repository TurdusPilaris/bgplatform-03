import {PostDocument, PostModel} from "../../../db/mongo/post/post.model";
import {ObjectId} from "mongodb";
import {TypePostInputModelModel} from "../../../input-output-types/posts/inputTypes";
import {blogsRepository} from "../../blogs/repositories/blogsRepository";


export const postsRepository = {
    async save(post: PostDocument){

        const result = await post.save();
        return result._id;
    },
    async findById(id: ObjectId): Promise<PostDocument| null> {
        return PostModel.findOne({_id: id})
    },
    async updatePost(post: PostDocument, dto: TypePostInputModelModel) {

        const blogForPost = await blogsRepository.findById(new ObjectId(dto.blogId))

        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        if(blogForPost) {
            post.blogId = dto.blogId;
            post.blogName = blogForPost.name;
        }
        await post.save();

    },
    async deletePost(id: ObjectId): Promise<boolean> {
         const res = await PostModel.deleteOne({_id: id})
         return res.deletedCount === 1
    },
}