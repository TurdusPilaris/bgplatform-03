import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";

export const jwtService = {

    async createToken(userId: ObjectId, expiresTime: string, SECRET_CODE: string) {

        return jwt.sign(
            {userId: userId},
            SECRET_CODE,
            {
                expiresIn: expiresTime
            }
        );

    },
    async decodeToken(token: string): Promise<any> {
      try {
          return jwt.decode(token);
      }catch (e: unknown){
          console.error("Cant decode token", e);
          return null;
      }
    },
    async getUserIdByToken(token: string, secretCode:string):Promise<ObjectId|null> {


        try {
            const result: any = jwt.verify(token, secretCode)
            return result.userId;
        } catch (error) {
            return null
        }
    }

}