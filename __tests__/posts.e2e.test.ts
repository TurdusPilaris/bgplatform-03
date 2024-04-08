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

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const posts = testSeeder.creatPostDtos(resBlog.body.id, resBlog.body.name, 15);

        for (let i = 0; i < posts.length; i++) {
            await req
                .post(SETTING.PATH_POSTS)
                .send(posts[i])
                .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
        }

        const res = await req
            .get(SETTING.PATH_POSTS + "?pageNumber=1&pageSize=11&sortBy=createdAt&sortDirection=asc")
            .expect(200);

        expect(res.body.items.length).toBe(11);
        expect(res.body.totalCount).toBe(posts.length);
        expect(res.body.pagesCount).toBe(2);
        expect(res.body.page).toBe(1);
        expect(res.body.items[0].title).toBe(posts[0].title)

    })

    it('POST posts OK 200 = []', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const newPostSeeder = testSeeder.createPost(resBlog.body.id, resBlog.body.name);

        const res = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)
            .expect(201);

        expect(res.body.title).toBe(newPostSeeder.title);
        expect(res.body.blogName).toBe(resBlog.body.name);
        expect(res.body.shortDescription).toBe(newPostSeeder.shortDescription);
        expect(res.body.content).toBe(newPostSeeder.content);

    })
    it('POST posts invalid authorization 401 = []', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const newPostSeeder = testSeeder.createPost(resBlog.body.id, resBlog.body.name);

        await req
            .post(SETTING.PATH_POSTS)
            .send(newPostSeeder)
            .expect(401);

    })

    it('POST posts inputModel "title" has incorrect values 400 = []', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const newPostSeeder = testSeeder.createPostInputModel(resBlog.body.id, 'a'.repeat(35));

        const res = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)
            .expect(400);

        expect(res.body.errorsMessages[0].field).toBe('title');

    })

    it('POST posts inputModel "shortDescription" has incorrect values 400 = []', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const newPostSeeder = testSeeder.createPostInputModel(resBlog.body.id, 'test title', 'sada'.repeat(26));

        const res = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)
            .expect(400);

        expect(res.body.errorsMessages[0].field).toBe('shortDescription');

    })

    it('POST posts inputModel "content" has incorrect values 400 = []', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const newPostSeeder = testSeeder.createPostInputModel(resBlog.body.id, 'test title', 'sada'.repeat(10), 'test'.repeat(251));

        const res = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)
            .expect(400);

        expect(res.body.errorsMessages[0].field).toBe('content');

    })

    it('POST posts inputModel "blog Id" has incorrect values 400 = []', async () => {

        const newPostSeeder = testSeeder.createPostInputModel("2546464646", 'test title', 'sada'.repeat(10), 'test'.repeat(2));

        const res = await req
            .post(SETTING.PATH_POSTS)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeeder)
            .expect(400);

        expect(res.body.errorsMessages[0].field).toBe('blogId');

    })

    it('Get posts by id 200 status []', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const resPost = await testSeeder.sendPostCreatePost(req, resBlog.body)

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

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const resPost = await testSeeder.sendPostCreatePost(req, resBlog.body)

        const res = await req
            .delete(SETTING.PATH_POSTS + '/' + resPost.body.id)
            .set({authorization: UNCORRECT_ADMIN_AUTH_BASE64})
            .expect(401);

    })

    it('DELETE posts success 204 []', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const resPost = await testSeeder.sendPostCreatePost(req, resBlog.body)

        const res = await req
            .delete(SETTING.PATH_POSTS + '/' + resPost.body.id)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .expect(204);

    })

    it('DELETE posts uncorrected id 404 []', async () => {

        const uncorrectedId = '232323232323232311111111'

        const res = await req
            .delete(SETTING.PATH_POSTS + '/' + uncorrectedId)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .expect(404);

    })

    it('Put posts by id 200 status []', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const resPost = await testSeeder.sendPostCreatePost(req, resBlog.body);

        const newPostSeederUpdate = testSeeder.createPostInputModel(resBlog.body.id, "Post updated",
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

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const resPost = await testSeeder.sendPostCreatePost(req, resBlog.body);

        const newPostSeederUpdate = testSeeder.createPostInputModel(resBlog.body.id, "Post".repeat(10),
            "Short updated", "Content Update");

        const res = await req
            .put(SETTING.PATH_POSTS + '/' + resPost.body.id)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeederUpdate)
            .expect(400)

        expect(res.body.errorsMessages[0].field).toBe('title');

    })

    it('Put posts by id 400 status "short description" []', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const resPost = await testSeeder.sendPostCreatePost(req, resBlog.body);

        const newPostSeederUpdate = testSeeder.createPostInputModel(resBlog.body.id, "Post".repeat(3),
            "Short".repeat(40), "Content Update");

        const res = await req
            .put(SETTING.PATH_POSTS + '/' + resPost.body.id)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeederUpdate)
            .expect(400)

        expect(res.body.errorsMessages[0].field).toBe('shortDescription');

    })

    it('Put posts by id 400 status "content" []', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const resPost = await testSeeder.sendPostCreatePost(req, resBlog.body);

        const newPostSeederUpdate = testSeeder.createPostInputModel(resBlog.body.id, "Post".repeat(3),
            "Short".repeat(10), "Content".repeat(150));

        const res = await req
            .put(SETTING.PATH_POSTS + '/' + resPost.body.id)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeederUpdate)
            .expect(400)

        expect(res.body.errorsMessages[0].field).toBe('content');

    })

    it('Put posts by id 401 status Unauthorized []', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const resPost = await testSeeder.sendPostCreatePost(req, resBlog.body);

        const newPostSeederUpdate = testSeeder.createPostInputModel(resBlog.body.id);

        const res = await req
            .put(SETTING.PATH_POSTS + '/' + resPost.body.id)
            .set({authorization: UNCORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeederUpdate)
            .expect(401)

    })

    it('Put posts by id 404 status Not found []', async () => {

        const uncorrectedId = '232323232323232311111111';

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const newPostSeederUpdate = testSeeder.createPostInputModel(resBlog.body.id);

        const res = await req
            .put(SETTING.PATH_POSTS + '/' + uncorrectedId)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(newPostSeederUpdate)
            .expect(404)

    })

    it('Post posts for blogID endpoint = /blogs/:blogId/posts OK 201', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const dtoPost =  testSeeder.createPostInputModelWithoutID();

        const res = await req
            .post(`/blogs/${resBlog.body.id}/posts`)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(dtoPost)
            .expect(201);

        expect(res.body.title).toBe(dtoPost.title);
        expect(res.body.shortDescription).toBe(dtoPost.shortDescription);
        expect(res.body.content).toBe(dtoPost.content);
        expect(res.body.blogId).toBe(resBlog.body.id);
        expect(res.body.blogName).toBe(resBlog.body.name);

    })

    it('Post posts for blogID endpoint = /blogs/:blogId/posts 401 Unauth', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const dtoPost =  testSeeder.createPostInputModelWithoutID();

        const res = await req
            .post(`/blogs/${resBlog.body.id}/posts`)
            .set({authorization: UNCORRECT_ADMIN_AUTH_BASE64})
            .send(dtoPost)
            .expect(401);

    })

    it('Post posts for blogID endpoint = /blogs/:blogId/posts invalid title 400', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const dtoPost =  testSeeder.createPostInputModelWithoutID("title".repeat(10));

        const res = await req
            .post(`/blogs/${resBlog.body.id}/posts`)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(dtoPost)
            .expect(400);

        expect(res.body.errorsMessages[0].field).toBe('title');

    })

    it('Post posts for blogID endpoint = /blogs/:blogId/posts invalid short description 400', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const dtoPost =  testSeeder.createPostInputModelWithoutID("title".repeat(2), "short".repeat(25));

        const res = await req
            .post(`/blogs/${resBlog.body.id}/posts`)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(dtoPost)
            .expect(400);

        expect(res.body.errorsMessages[0].field).toBe('shortDescription');

    })

    it('Post posts for blogID endpoint = /blogs/:blogId/posts invalid content 400', async () => {

        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const dtoPost =  testSeeder.createPostInputModelWithoutID("title".repeat(2), "short".repeat(2), "contentdss".repeat(101));

        const res = await req
            .post(`/blogs/${resBlog.body.id}/posts`)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(dtoPost)
            .expect(400);

        expect(res.body.errorsMessages[0].field).toBe('content');

    })

    it('Post posts for blogID endpoint = /blogs/:blogId/posts blog not found 404', async () => {

        const uncorrectedId = '232323232323232311111111'

        const dtoPost =  testSeeder.createPostInputModelWithoutID();

        const res = await req
            .post(`/blogs/${uncorrectedId}/posts`)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(dtoPost)
            .expect(404);

    })

    it('GET posts for blogID endpoint = /blogs/:blogId/posts OK 200', async () => {


        const resBlog = await testSeeder.sendPostCreateBlog(req);

        const dtoPost =  testSeeder.createPostInputModelWithoutID();

        const resPost1 = await req
            .post(`/blogs/${resBlog.body.id}/posts`)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(dtoPost)

        const dtoPost2 =  testSeeder.createPostInputModelWithoutID("title 2", "short description 2", "content 2");

        const resPost2 = await req
            .post(`/blogs/${resBlog.body.id}/posts`)
            .set({authorization: CORRECT_ADMIN_AUTH_BASE64})
            .send(dtoPost2)

        const res = await req
            .get(`/blogs/${resBlog.body.id}/posts?pageNumber=1&pageSize=10&sortBy=createdAt&sortDirection=asc`)
            .expect(200);

        expect(res.body.items[0].title).toBe(resPost1.body.title)
        console.log(res.body)

    })
})