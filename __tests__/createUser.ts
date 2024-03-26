import {testSeeder} from "./test.seeder";
import {SETTING} from "../src/main/setting";
import req from "supertest"

const CORRECT_ADMIN_AUTH_BASE64 = 'Basic YWRtaW46cXdlcnR5';
export const createUser = async (app:any) => {
    const userDto = testSeeder.createUserDTO();
    const resp = await req(app)
        .post( SETTING.PATH_USERS)
        .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
        .send(userDto)
        .expect(201)

    return resp.body;
}

export const createUsers = async (app:any, count: number) => {

    const users = [];
    const usersDto = testSeeder.creatUserDtos(count);
    for(let i = 0; i < usersDto.length; i++) {
        const resp = await req(app)
            .post(SETTING.PATH_USERS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(usersDto[i])
            .expect(201)
        users.push(resp.body)
    }
    return users;
}