import {UserDB} from "../../../input-output-types/inputOutputTypesMongo";
import {UserModel} from "../../../db/mongo/user/user.model";

export class UsersRepository{
    async save(user: UserDB){
        const newUser = new UserModel(user);
        const result = await newUser.save();
        return result._id;
    }
}