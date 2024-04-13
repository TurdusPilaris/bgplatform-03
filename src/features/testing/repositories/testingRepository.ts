import {PostModel} from "../../../db/mongo/post/post.model";
import {BlogModel} from "../../../db/mongo/blog/blog.model";
import {UserModel} from "../../../db/mongo/user/user.model";
import {CommentModel} from "../../../db/mongo/comment/comment.model";
import {DeviceAuthSessionsModel} from "../../../db/mongo/devicesAuthSessions/deviceAuthSession.model";
import {CustomRateLimitModel} from "../../../db/mongo/customRateLimit/customRateLimit.model";

export class TestingRepository{
    async deleteAll() {
        await PostModel.deleteMany({});
        await BlogModel.deleteMany({});
        await UserModel.deleteMany({});
        await CommentModel.deleteMany({});
        await CustomRateLimitModel.deleteMany({});
        await DeviceAuthSessionsModel.deleteMany({});

    }
}