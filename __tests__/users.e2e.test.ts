import {agent as supertest} from 'supertest';
import {app} from "../src/main/app";
import {db} from "../src/db/mongo/mongo-db";
import {MongoMemoryServer} from "mongodb-memory-server";
import {SETTING} from "../src/main/setting";
import {testSeeder} from "./test.seeder";
import {createUser} from "./createUser";

const CORRECT_ADMIN_AUTH_BASE64 = 'Basic YWRtaW46cXdlcnR5';
const UNCORRECT_ADMIN_AUTH_BASE64 = 'Basic YWRtaW46cXdlcnR9';

const req = supertest(app);

describe('/users', () => {
    // const app = init
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        SETTING.MONGO_URL = mongoServer.getUri();
        await db.run();
    })

    beforeEach(async () => {
        await db.drop()
    })
    afterAll(async () => {
        await db.stop()
    })

    it('should create user with correct data by sa and return status 200', async () => {
        const userDto = testSeeder.createUserDTO();
        const newUser = await req
            .post(SETTING.PATH_USERS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(userDto)
            .expect(201)

    })

    it("shouldn't create user twice with correct data by sa and return status 400", async () => {
        const userDto = testSeeder.createUserDTO();
        const newUser1 = await req
            .post(SETTING.PATH_USERS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(userDto)
            .expect(201)

        const newUser = await req
            .post(SETTING.PATH_USERS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(userDto)
            .expect(400)
    })

    it("shouldn't create user invalid login and return status 400", async () => {
        const userDto = testSeeder.createUserDTOWithInvalidLogin();

        const newUser = await req
            .post(SETTING.PATH_USERS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(userDto)
            .expect(400)
    })

    it("shouldn't create user invalid password and return status 400", async () => {
        const userDto = testSeeder.createUserDTOWithInvalidPassword();

        const newUser = await req
            .post(SETTING.PATH_USERS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(userDto)
            .expect(400)
    })

    it("shouldn't create user invalid email and return status 400", async () => {
        const userDto = testSeeder.createUserDTOWithInvalidEmail();

        const newUser = await req
            .post(SETTING.PATH_USERS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(userDto)
            .expect(400)
    })

    it("shouldn't delete user by id without authorization and return status 400", async () => {

        const user = await createUser(app);
        await req.delete(`${SETTING.PATH_USERS + '/' + user.id}`).expect(401)
    })

    it("should delete user by id  and return status 204", async () => {

        const user = await createUser(app);
        await req.delete(`${SETTING.PATH_USERS + '/' + user.id}`).set({authorization: CORRECT_ADMIN_AUTH_BASE64}).expect(204)

    })

    it("shouldn't delete user by id if user is not exists and return status 404", async () => {

        const user = await createUser(app);
        const invalidUid = '6666' + user.id.slice(4);
        await req.delete(`${SETTING.PATH_USERS + '/' + invalidUid}`).set({authorization: CORRECT_ADMIN_AUTH_BASE64}).expect(404)

    })

})