import {
    UserAccountDBType,
} from "../../../input-output-types/inputOutputTypesMongo";
import {ObjectId, WithId} from "mongodb";
import {UserQueryType} from "../../../input-output-types/inputTypes";
import {MeViewModelType, PaginatorUserType, UserViewModelType} from "../../../input-output-types/users/outputTypes";
import {ResultObject} from "../../../common/types/result.types";
import {ResultStatus} from "../../../common/types/resultCode";
import {UserModel} from "../../../db/mongo/user/user.model";

export class UsersQueryRepository{

    async find(id: ObjectId) {
        return UserModel.findOne({_id: id});
    }
    async findForOutput(id: ObjectId) {
        const foundUser =  await this.find(id);
        if(!foundUser) {return null}
        return this.mapToOutput(foundUser);
    }
    mapToOutput(user: WithId<UserAccountDBType>):UserViewModelType {
        return {
            id: user._id.toString(),
            login: user.accountData.userName,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt,
        }
    }
    async getAllUsers(query:UserQueryType) {

        const filterLoginOrEmail = {
            $or:[
                {"accountData.userName": { $regex: query.searchLoginTerm ?? '', $options: 'i'}},
                {"accountData.email": { $regex: query.searchEmailTerm ?? '', $options: 'i'}},
            ]
        }

        const items = await UserModel
            .find(filterLoginOrEmail)
            .sort({[query.sortBy]: query.sortDirection})
            .skip((query.pageNumber -1)*query.pageSize)
            .limit(query.pageSize)
            .lean();

        const itemsForPaginator = items.map(this.mapToOutput);
        const countPosts = await UserModel.countDocuments(filterLoginOrEmail);
        const paginatorPost: PaginatorUserType =
            {
                pagesCount:	Math.ceil(countPosts/query.pageSize),
                page:	query.pageNumber,
                pageSize:	query.pageSize,
                totalCount: countPosts,
                items: itemsForPaginator
            };
        return paginatorPost;
    }
    loginOrEmailFilter(nameUser: string|undefined, email: string|undefined) {

        if(nameUser) return {"accountData.userName": nameUser};
        if(email) return {"accountData.email": email};
        return {}
    }
    async getCountDocumentWithFilter(login:string|undefined, email: string|undefined) {

        return UserModel.countDocuments(this.loginOrEmailFilter(login, email));

    }
    async findByLoginOrEmail(loginOrEmail: string) {
        const filterLoginOrEmail = {
            $or:[
                {"accountData.userName": { $regex: loginOrEmail ?? '', $options: 'i'}},
                {"accountData.email": { $regex: loginOrEmail ?? '', $options: 'i'}},
            ]
        }
        return UserModel.findOne(filterLoginOrEmail);

    }
    async findByCodeConfirmation(code: string) {
        const filterCodeConfirmation =
                {"emailConfirmation.confirmationCode": { $regex: code ?? '', $options: 'i'}}

        return UserModel.findOne(filterCodeConfirmation);

    }
    mapToOutputMe(user: WithId<UserAccountDBType>):MeViewModelType {
        return {
            login: user.accountData.userName,
            email: user.accountData.email,
            userId: user._id.toString(),
        }
    }
    async getAboutMe(userId: string | null):Promise<ResultObject<MeViewModelType|null>> {
        if(!userId) return {
            status: ResultStatus.NotFound,
            data: null
        }
        const user = await UserModel.findOne({_id: new ObjectId(userId)})

        if(!user) return {
            status: ResultStatus.NotFound,
            data: null
        }

        return {
            status: ResultStatus.Success,
            data: this.mapToOutputMe(user!)
        }
    }
}