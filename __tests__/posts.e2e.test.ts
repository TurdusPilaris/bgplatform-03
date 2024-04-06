import {agent as supertest} from 'supertest';
import {app} from "../src/main/app";
import {blogCollection, db, postCollection} from "../src/db/mongo/mongo-db";
import {MongoMemoryServer} from "mongodb-memory-server";
import {SETTING} from "../src/main/setting";
import {testSeeder} from "./test.seeder";
import {postQueryRepository} from "../src/features/posts/repositories/postQueryRepository";
import {ObjectId} from "mongodb";

const CORRECT_ADMIN_AUTH_BASE64 = 'Basic YWRtaW46cXdlcnR5';
const UNCORRECT_ADMIN_AUTH_BASE64 = 'Basic YWRtaW46cXdlcnR9';

const req = supertest(app);

describe('/posts', () => {
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

    it('GET posts OK 200 = []', async () => {

        const newBlog = await blogCollection.insertOne(testSeeder.createBlog());

        const newPostSeeder = testSeeder.createPost(newBlog.insertedId.toString(), testSeeder.createBlog().name);
        const newPost = await postCollection.insertOne(newPostSeeder);

        const res = await req
            .get(SETTING.PATH_POSTS)
            .expect(200);

        expect(res.body.items.length).toBe(1);
        expect(res.body.items[0].id).toBe(newPost.insertedId.toString());
        expect(res.body.items[0].blogId).toBe(newBlog.insertedId.toString());

    })

    it('POST posts OK 200 = []', async () => {

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel(newBlog.insertedId.toString());

        const res = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)
            .expect(201);

        expect(res.body.title).toBe(newPostSeeder.title);
        expect(res.body.blogName).toBe(newBlogSeeder.name);
        expect(res.body.shortDescription).toBe("shortDescription test 1");
        expect(res.body.content).toBe("input.content test 1");

    })
    it('POST posts invalid authorization 401 = []', async () => {

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel(newBlog.insertedId.toString());

        await req
            .post(SETTING.PATH_POSTS)
            .send(newPostSeeder)
            .expect(401);

    })

    it('POST posts inputModel "title" has incorrect values 400 = []', async () => {

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel(newBlog.insertedId.toString(),
            'a'.repeat(35));

        const res = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)
            .expect(400);

        expect(res.body.errorsMessages[0].field).toBe('title');
    })

    it('POST posts inputModel "shortDescription" has incorrect values 400 = []', async () => {

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel(newBlog.insertedId.toString(), 'test title', 'sada'.repeat(26));

        const res = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)
            .expect(400);

        expect(res.body.errorsMessages[0].field).toBe('shortDescription');
    })

    it('POST posts inputModel "content" has incorrect values 400 = []', async () => {

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel(newBlog.insertedId.toString(), 'test title', 'sada'.repeat(10), 'test'.repeat(251));

        const res = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)
            .expect(400);

        expect(res.body.errorsMessages[0].field).toBe('content');
    })

    it('POST posts inputModel "blog Id" has incorrect values 400 = []', async () => {

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel('2546464646', 'test title', 'sada'.repeat(10), 'test'.repeat(25));

        const res = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)
            .expect(400);

        expect(res.body.errorsMessages[0].field).toBe('blogId');
    })

    it('Get posts by id 200 status []', async () => {

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel(newBlog.insertedId.toString());

        const resPost = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)


        const res = await req
            .get(SETTING.PATH_POSTS + '/' + resPost.body.id)
            .expect(200)

        expect(res.body.id).toBe(resPost.body.id);
        expect(res.body.title).toBe(resPost.body.title);
        expect(res.body.blogName).toBe(resPost.body.blogName);
        expect(res.body.shortDescription).toBe(resPost.body.shortDescription);
        expect(res.body.content).toBe(resPost.body.content);

    })

    it('Get posts by id 404 status []', async () => {

        const uncorrectedId = '232323232323232311111111'
        const res = await req
            .get(SETTING.PATH_POSTS + '/' + uncorrectedId)
            .expect(404)

    })

    it('DELETE posts 401 not auth Unauthorized= []', async () => {

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel(newBlog.insertedId.toString());

        const resPost = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)

        const res = await req
            .delete(SETTING.PATH_POSTS + '/' + resPost.body.id)
            .set({authorization: UNCORRECT_ADMIN_AUTH_BASE64})
            .expect(401);

    })

    it('DELETE posts success 204 []', async () => {

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel(newBlog.insertedId.toString());

        const resPost = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)

        const res = await req
            .delete(SETTING.PATH_POSTS + '/' + resPost.body.id)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .expect(204);

    })

    it('DELETE posts uncorrected id 404 []', async () => {

        const uncorrectedId = '232323232323232311111111'

        const res = await req
            .delete(SETTING.PATH_POSTS+ '/' + uncorrectedId)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .expect(404);

    })

    it('Put posts by id 200 status []', async () => {

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel(newBlog.insertedId.toString());

        const resPost = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)


        const newPostSeederUpdate = testSeeder.createPostInputModel(newBlog.insertedId.toString(), "Post updated",
            "Short updated", "Content Update");

        const res = await req
            .put(SETTING.PATH_POSTS + '/' + resPost.body.id)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeederUpdate)
            .expect(204)

        const postUpdated = await postQueryRepository.findForOutput(new ObjectId(resPost.body.id));

        expect(postUpdated).not.toBeUndefined();

        expect(newPostSeederUpdate.title).toBe(postUpdated!.title);
        expect(newPostSeederUpdate.content).toBe(postUpdated!.content);

    })

    it('Put posts by id 400 status "title" []', async () => {

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel(newBlog.insertedId.toString());

        const resPost = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)


        const newPostSeederUpdate = testSeeder.createPostInputModel(newBlog.insertedId.toString(), "Post".repeat(10),
            "Short updated", "Content Update");

        const res = await req
            .put(SETTING.PATH_POSTS + '/' + resPost.body.id)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeederUpdate)
            .expect(400)

        expect(res.body.errorsMessages[0].field).toBe('title');

    })

    it('Put posts by id 400 status "short description" []', async () => {

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel(newBlog.insertedId.toString());

        const resPost = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)


        const newPostSeederUpdate = testSeeder.createPostInputModel(newBlog.insertedId.toString(), "Post".repeat(3),
            "Short".repeat(40), "Content Update");

        const res = await req
            .put(SETTING.PATH_POSTS + '/' + resPost.body.id)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeederUpdate)
            .expect(400)

        expect(res.body.errorsMessages[0].field).toBe('shortDescription');

    })

    it('Put posts by id 400 status "content" []', async () => {

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel(newBlog.insertedId.toString());

        const resPost = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)


        const newPostSeederUpdate = testSeeder.createPostInputModel(newBlog.insertedId.toString(), "Post".repeat(3),
            "Short".repeat(10), "Content".repeat(150));

        const res = await req
            .put(SETTING.PATH_POSTS + '/' + resPost.body.id)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeederUpdate)
            .expect(400)

        expect(res.body.errorsMessages[0].field).toBe('content');

    })

    it('Put posts by id 401 status Unauthorized []', async () => {

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel(newBlog.insertedId.toString());

        const resPost = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)


        const newPostSeederUpdate = testSeeder.createPostInputModel(newBlog.insertedId.toString());

        const res = await req
            .put(SETTING.PATH_POSTS + '/' + resPost.body.id)
            .set({authorization: UNCORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeederUpdate)
            .expect(401)

    })

    it('Put posts by id 404 status Not found []', async () => {

        const uncorrectedId = '232323232323232311111111';

        const newBlogSeeder = testSeeder.createBlog();
        const newBlog = await blogCollection.insertOne(newBlogSeeder);

        const newPostSeeder = testSeeder.createPostInputModel(newBlog.insertedId.toString());

        const resPost = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)


        const newPostSeederUpdate = testSeeder.createPostInputModel(newBlog.insertedId.toString());

        const res = await req
            .put(SETTING.PATH_POSTS + '/' + uncorrectedId)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeederUpdate)
            .expect(404)

    })

    it('GET posts for blogID endpoint = /blogs/:blogId/posts ', async () => {

        const newBlog = {
            name: "name for test",
            description: "description for test",
            websiteUrl: "websiteUrl.com",
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        const info = await blogCollection.insertOne(newBlog);

        const newPost= {
            title: "post test 1",
            shortDescription: "shortDescription test 1",
            content: "input.content test 1",
            blogId: info.insertedId.toString(),
            blogName: newBlog.name,
            createdAt: new Date().toISOString(),
        }

        const newPost2= {
            title: "post test 2",
            shortDescription: "shortDescription test 2",
            content: "input.content test 2",
            blogId: info.insertedId.toString(),
            blogName: newBlog.name,
            createdAt: new Date().toISOString(),
        }

         await postCollection.insertOne(newPost);
         await postCollection.insertOne(newPost2);

        const res = await req
            .get(`/blogs/${info.insertedId.toString()}/posts?pageNumber=1&pageSize=10&sortBy=createdAt&sortDirection=asc&searchNameTerm=2`)
            .expect(200);


    })
})