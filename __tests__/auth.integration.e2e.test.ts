import {MongoMemoryServer} from "mongodb-memory-server";
import {SETTING} from "../src/main/setting";
import {db} from "../src/db/mongo/mongo-db";
import {authService} from "../src/features/auth/domain/auth-service";
import {businessService} from "../src/common/domain/business-service";
import {emailServiceMock} from "./mock";
import {agent as supertest} from "supertest";
import {app} from "../src/main/app";
import {testSeeder} from "./test.seeder";
import {ResultStatus} from "../src/common/types/resultCode";

const req = supertest(app);
describe('AUTH-INTEGRATION', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        SETTING.MONGO_URL = mongoServer.getUri();
        await db.run();
    })
    beforeEach(async () => {
        await db.drop()
    })
    afterAll(async () => {
        await db.drop()
        await db.stop()
    })

    describe('User Registration', () => {

        const registerUserUseCase = authService.registerUser;

         // businessService.sendRegisrtationEmail = emailServiceMock.sendRegisrtationEmail;

        // businessService.sendRegisrtationEmail = jest.fn()

        console.log('im here');
        businessService.sendRegisrtationEmail = jest.fn().mockImplementation((email: string, confirmationCode: string) => {
            console.log('email in mock', email)
            return true
        })



        it('should register user with correct data', async () => {
            const {login, email, password} = testSeeder.createUserDTO();
            const result = await registerUserUseCase(login, email, password)

            console.log(result)
            // expect(result).toEqual({
            //     login,
            //     email,
            //     passwordHash: expect.any(String),
            //     createdAt: expect.any(String),
            // })
            expect(result).toEqual({
                status: ResultStatus.Success,
                data: null
            })
            expect(businessService.sendRegisrtationEmail).toBeCalled()
            expect(businessService.sendRegisrtationEmail).toBeCalledTimes(1)

        })

        it('should not register user twice', async () => {
            const {login, email, password} = testSeeder.createUserDTO();
            await testSeeder.registerUser({login, password, email})
            const result = await registerUserUseCase(login, email, password)

            expect(result).toEqual({
                status: ResultStatus.BadRequest,
                data: null
            })
        })
    })
})