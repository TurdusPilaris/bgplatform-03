import {MongoMemoryServer} from "mongodb-memory-server";
import {app} from "../src/main/app";
import {SETTING} from "../src/main/setting";
import {db} from "../src/db/mongo/mongo-db";
import {jwtService} from "../src/common/adapters/jwt-service";
import {userQueryRepository} from "../src/features/users/infrastructure/userQueryRepository";
import {createUser} from "./createUser";
import {testSeeder} from "./test.seeder";

describe('UNIT', () => {
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

    it('should not verify in jwtService', async() =>{
        jwtService.getUserIdByToken = jest.fn().mockImplementation((token:string) => {
            return null;
        })

    })

    it('should be success in jwtService', async() =>{
        jwtService.getUserIdByToken = jest.fn().mockImplementation((token:string) => {
            return {userId:1};
        })

        userQueryRepository.findForOutput = jest.fn().mockImplementation((userId:string) => {
            return testSeeder.createUserMongoDTO();
        })
    })
})