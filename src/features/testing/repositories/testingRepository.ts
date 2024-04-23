import {PostModel} from "../../posts/domain/postModel";
import {BlogModel} from "../../../db/mongo/blog/blog.model";
import {UserModel} from "../../../db/mongo/user/user.model";
import {CommentModel} from "../../feedBacks/domain/commentModel";
import {DeviceAuthSessionsModel} from "../../../db/mongo/devicesAuthSessions/deviceAuthSession.model";
import {CustomRateLimitModel} from "../../../db/mongo/customRateLimit/customRateLimit.model";
import {injectable} from "inversify";
import {LikesModel} from "../../feedBacks/domain/likes.entity";
@injectable()
export class TestingRepository{
    async deleteAll() {
        await PostModel.deleteMany({});
        await BlogModel.deleteMany({});
        await UserModel.deleteMany({});
        await LikesModel.deleteMany({});
        await CommentModel.deleteMany({});
        await CustomRateLimitModel.deleteMany({});
        await DeviceAuthSessionsModel.deleteMany({});

    }
}