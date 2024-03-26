import {
    UserAccountDBMongoType,
} from "../../../input-output-types/inputOutputTypesMongo";
import {userCollection} from "../../../db/mongo-db";
import {ObjectId} from "mongodb";
import {UserQueryType} from "../../../input-output-types/inputTypes";
import {userMongoRepository} from "./usersMongoRepositories";
import {MeViewModelType, PaginatorUserType, UserViewModelType} from "../../../input-output-types/users/outputTypes";
import {ResultObject} from "../../../common/types/result.types";
import {ResultStatus} from "../../../common/types/resultCode";


export const userQueryRepository ={

    async findForOutput(id: ObjectId) {
        return  await userMongoRepository.findForOutput(id);
    },
    mapToOutput(user: UserAccountDBMongoType):UserViewModelType {
        return {
            id: user._id.toString(),
            login: user.accountData.userName,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt,

        }
    },

    getAllUsers: async function (query:UserQueryType) {

        const filterLoginOrEmail = {
            $or:[
                {"accountData.userName": { $regex: query.searchLoginTerm ?? '', $options: 'i'}},
                {"accountData.email": { $regex: query.searchEmailTerm ?? '', $options: 'i'}},
            ]
        }

        const items = await userCollection
            .find(filterLoginOrEmail)
            .sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber -1)*query.pageSize)
            .limit(query.pageSize)
            .toArray();

        const itemsForPaginator = items.map(this.mapToOutput);
        const countPosts = await userCollection.countDocuments(filterLoginOrEmail);
        const paginatorPost: PaginatorUserType =
            {
                pagesCount:	Math.ceil(countPosts/query.pageSize),
                page:	query.pageNumber,
                pageSize:	query.pageSize,
                totalCount: countPosts,
                items: itemsForPaginator
            };
        return paginatorPost;


    },

    loginOrEmailFilter(nameUser: string|undefined, email: string|undefined) {

        if(nameUser) return {"accountData.userName": nameUser};
        if(email) return {"accountData.email": email};
        return {}
    },
    getCountDocumentWithFilter: async function (login:string|undefined, email: string|undefined) {

        console.log("login filter------ " + JSON.stringify(this.loginOrEmailFilter(login, email)))
        return await userCollection.countDocuments(this.loginOrEmailFilter(login, email));

    },
    async findByLoginOrEmail(loginOrEmail: string) {
        const filterLoginOrEmail = {
            $or:[
                {"accountData.userName": { $regex: loginOrEmail ?? '', $options: 'i'}},
                {"accountData.email": { $regex: loginOrEmail ?? '', $options: 'i'}},
            ]
        }
        return await userCollection.findOne(filterLoginOrEmail) as UserAccountDBMongoType;

    },
    async findByCodeConfirmation(code: string) {
        const filterCodeConfirmation =
                {"emailConfirmation.confirmationCode": { $regex: code ?? '', $options: 'i'}}

        return await userCollection.findOne(filterCodeConfirmation) as UserAccountDBMongoType;

    },
    mapToOutputMe(user: UserAccountDBMongoType):MeViewModelType {
        return {
            login: user.accountData.userName,
            email: user.accountData.email,
            userId: user._id.toString(),

        }
    },
    async getAboutMe(userId: string | null):Promise<ResultObject<MeViewModelType|null>> {
        if(!userId) return {
            status: ResultStatus.NotFound,
            data: null
        }
        const user = await userCollection.findOne({_id: new ObjectId(userId)})

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