import {agent as supertest} from 'supertest';
import {app} from "../src/main/app";
import {blogCollection, db} from "../src/db/mongo/mongo-db";
import {MongoMemoryServer} from "mongodb-memory-server";

import {SETTING} from "../src/main/setting";
import {testSeeder} from "./test.seeder";
import {createUser} from "./createUser";
import {postQueryRepository} from "../src/features/posts/repositories/postQueryRepository";
import {ObjectId} from "mongodb";
import {blogQueryRepository} from "../src/features/blogs/repositories/blogQueryRepository";

const CORRECT_ADMIN_AUTH_BASE64 = 'Basic YWRtaW46cXdlcnR5';
const UNCORRECT_ADMIN_AUTH_BASE64 = 'Basic YWRtaW46cXdlcnR9';
// import {describe} from "node:test";


const req = supertest(app);

describe('/blogs', () => {
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

    it('GET blogs 200 status []', async () => {

        const blogs = testSeeder.creatBlogDtos(5);

        for(let i = 0; i++; i++ ){
            await req
                .post(SETTING.PATH_BLOGS)
                .send(blogs[i])
                .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
        }
        const res = await req
            .get(SETTING.PATH_BLOGS)
            .expect(200);

        expect(res.body.items.length).toBe(blogs.length);
    })

    it('Post blogs 401 status []', async () => {

        const bodyPostBlog = testSeeder.createBlog();

        const res = await req
            .post(SETTING.PATH_BLOGS)
            .send(bodyPostBlog)
            .set({authorization: UNCORRECT_ADMIN_AUTH_BASE64})
            .expect(401);

    })

    it('Post blogs 200 status []', async () => {

        const bodyPostBlog = testSeeder.createBlog();
        const res = await req
            .post(SETTING.PATH_BLOGS)
            .send(bodyPostBlog)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .expect(201);

        expect(res.body.name).toBe(bodyPostBlog.name);
        expect(res.body.description).toBe(bodyPostBlog.description);
        expect(res.body.websiteUrl).toBe(bodyPostBlog.websiteUrl);
    })

    it('Get blogs by id 200 status []', async () => {

        const bodyPostBlog = testSeeder.createBlog();
        const resPost = await req
            .post(SETTING.PATH_BLOGS)
            .send(bodyPostBlog)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})

        const res = await req
            .get(SETTING.PATH_BLOGS + "/" + resPost.body.id)
            .expect(200)

        expect(res.body.name).toBe(bodyPostBlog.name);
        expect(res.body.description).toBe(bodyPostBlog.description);
        expect(res.body.websiteUrl).toBe(bodyPostBlog.websiteUrl);
        expect(res.body.id).toBe(resPost.body.id);
        expect(res.body.isMembership).toBe(false);
    })

    it('Get blogs by id 404 status []', async () => {

        const uncorrectedId = '232323232323232311111111'
        const res = await req
            .get(SETTING.PATH_BLOGS + "/" + uncorrectedId)
            .expect(404)

    })

    it('DELETE blogs 401 not auth Unauthorized= []', async () => {

        const bodyPostBlog = testSeeder.createBlog();
        const resPost = await req
            .post(SETTING.PATH_BLOGS)
            .send(bodyPostBlog)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})

        const res = await req
            .delete(SETTING.PATH_BLOGS + '/' + resPost.body.id)
            .set({authorization: UNCORRECT_ADMIN_AUTH_BASE64})
            .expect(401);

    })

    it('DELETE blogs success 204 []', async () => {

        const bodyPostBlog = testSeeder.createBlog();
        const resPost = await req
            .post(SETTING.PATH_BLOGS)
            .send(bodyPostBlog)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})

        const res = await req
            .delete(SETTING.PATH_BLOGS + '/' + resPost.body.id)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .expect(204);

    })

    it('DELETE blogs uncorrected id 404 []', async () => {

        const uncorrectedId = '232323232323232311111111'

        const res = await req
            .delete(SETTING.PATH_BLOGS + '/' + uncorrectedId)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .expect(404);

    })

    it('Put posts by id 200 status []', async () => {

        const newBlogSeeder = testSeeder.createBlogInput();

        const resBlog = await req
            .post(SETTING.PATH_BLOGS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newBlogSeeder)


        const newBlogSeederUpdate = testSeeder.createBlogInput("Blog test upd",
            "Description updated", "2323232@gmail.com");

        const res = await req
            .put(SETTING.PATH_BLOGS + '/' + resBlog.body.id)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newBlogSeederUpdate)
            .expect(204)

        const blogUpdated = await blogQueryRepository.findForOutput(new ObjectId(resBlog.body.id));

        expect(blogUpdated).not.toBeUndefined();

        expect(newBlogSeederUpdate.name).toBe(blogUpdated!.name);
        expect(newBlogSeederUpdate.description).toBe(blogUpdated!.description);
        expect(newBlogSeederUpdate.websiteUrl).toBe(blogUpdated!.websiteUrl);

    })

    it('Put posts by id 400 status "name "[]', async () => {

        const newBlogSeeder = testSeeder.createBlogInput();

        const resBlog = await req
            .post(SETTING.PATH_BLOGS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newBlogSeeder)


        const newBlogSeederUpdate = testSeeder.createBlogInput("Blog test update",
            "Description updated", "2323232@gmail.com");

        const res = await req
            .put(SETTING.PATH_BLOGS + '/' + resBlog.body.id)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newBlogSeederUpdate)
            .expect(400)

        expect(res.body.errorsMessages[0].field).toBe('name');

    })

    it('Put posts by id 400 status "description "[]', async () => {

        const newBlogSeeder = testSeeder.createBlogInput();

        const resBlog = await req
            .post(SETTING.PATH_BLOGS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newBlogSeeder)


        const newBlogSeederUpdate = testSeeder.createBlogInput("Blog test upd",
            "Description".repeat(50), "2323232@gmail.com");

        const res = await req
            .put(SETTING.PATH_BLOGS + '/' + resBlog.body.id)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newBlogSeederUpdate)
            .expect(400)

        expect(res.body.errorsMessages[0].field).toBe('description');

    })

    it('Put posts by id 400 status "websiteUrl "[]', async () => {

        const newBlogSeeder = testSeeder.createBlogInput();

        const resBlog = await req
            .post(SETTING.PATH_BLOGS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newBlogSeeder)


        const newBlogSeederUpdate = testSeeder.createBlogInput("Blog test upd",
            "Description".repeat(1), "2323232com");

        const res = await req
            .put(SETTING.PATH_BLOGS + '/' + resBlog.body.id)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newBlogSeederUpdate)
            .expect(400)

        expect(res.body.errorsMessages[0].field).toBe('websiteUrl');

    })

    it('Put posts by id 401 status Unauthorized"[]', async () => {

        const newBlogSeeder = testSeeder.createBlogInput();

        const resBlog = await req
            .post(SETTING.PATH_BLOGS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newBlogSeeder)


        const newBlogSeederUpdate = testSeeder.createBlogInput("Blog test upd",
            "Description".repeat(1));

        const res = await req
            .put(SETTING.PATH_BLOGS + '/' + resBlog.body.id)
            .set({authorization: UNCORRECT_ADMIN_AUTH_BASE64})
            .send(newBlogSeederUpdate)
            .expect(401)

    })

    it('Put posts by id 404 status Not found"[]', async () => {

        const uncorrectedId = '232323232323232311111111';

        const newBlogSeeder = testSeeder.createBlogInput();

        const resBlog = await req
            .post(SETTING.PATH_BLOGS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newBlogSeeder)


        const newBlogSeederUpdate = testSeeder.createBlogInput("Blog test upd",
            "Description".repeat(1));

        const res = await req
            .put(SETTING.PATH_BLOGS + '/' + uncorrectedId)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newBlogSeederUpdate)
            .expect(404)

    })
})