import {
    BlogDBMongoType,
    PostDBMongoTypeWithoutID,
    UserAccountDBMongoType
} from "../src/input-output-types/inputOutputTypesMongo";
import {RegisterUserType} from "./types/typesTests";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns";
import {userCollection} from "../src/db/mongo/mongo-db";
import {TypeBlogInputModel} from "../src/features/blogs/types/inputTypes";
import {TypePostInputModelModel} from "../src/input-output-types/posts/inputTypes";

export const testSeeder = {
    createUserDTO() {
        return {
            login: 'test',
            email: 'test@email.com',
            password: '1234567'
        }
    },
    createBlog(): BlogDBMongoType {
        return {
            name: "Test blog",
            description: "description for test",
            websiteUrl: "websiteUrl.com",
            createdAt: new Date().toISOString(),
            isMembership: false
        }
    },

    creatBlogDtos(count: number) {
        const blogs = [];
        for (let i = 0; i < count; i++) {
            blogs.push({
                name: "Test blog" + i,
                description: "description for test" + i,
                websiteUrl: "websiteUrl${i}@gmail.com",
                createdAt: new Date().toISOString(),
                isMembership: false
            })
        }
        return blogs;
    },
    createBlogInput(name?: string,
                    description?: string, websiteUrl?: string): TypeBlogInputModel {
        return {
            name: name || "Test blog",
            description: description || "description for test",
            websiteUrl: websiteUrl || "websiteUrl.com"
        }
    },
    createPost(blogId: string, blogName: string): PostDBMongoTypeWithoutID {
        return {
            title: "post test 1",
            shortDescription: "shortDescription test 1",
            content: "input.content test 1",
            blogId: blogId,
            blogName: blogName,
            createdAt: new Date().toISOString(),
        }
    },
    createPostInputModel(blogId: string, title?: string,
                         shortDescription?: string, content?: string): TypePostInputModelModel {
        return {
            title: title || "post test 1 input",
            shortDescription: shortDescription || "shortDescription test 1",
            content: content || "input.content test 1",
            blogId: blogId
        }
    },
    createUserMongoDTO(): UserAccountDBMongoType {
        return {
            _id: new ObjectId(),
            accountData: {
                userName: 'test',
                email: 'test@email.com',
                passwordHash: 'ergergerg64565790570i',
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                isConfirmed: false,
                expirationDate: new Date(),
                confirmationCode: 'gdgergr-fdgfg-dggd-fgdg'
            }

        }
    },
    createUserDTOWithInvalidLogin() {
        return {
            login: 'te',
            email: 'test3@email.com',
            password: '1234567'
        }
    },
    createUserDTOWithInvalidPassword() {
        return {
            login: 'test2',
            email: 'test2@email.com',
            password: '123'
        }
    },
    createUserDTOWithInvalidEmail() {
        return {
            login: 'test3',
            email: '2222222222',
            password: '12364645645'
        }
    },
    creatUserDtos(count: number) {
        const users = [];
        for (let i = 0; i < count; i++) {
            users.push({
                login: 'test' + i,
                email: `test${i}email.com`,
                password: '1234567'
            })
        }
        return users;
    },
    async registerUser(
        {
            login,
            password,
            email
        }: RegisterUserType
    ): Promise<UserAccountDBMongoType> {
        // @ts-ignore
        const newUser: UserAccountDBMongoType = {
            _id: new ObjectId(),
            accountData: {
                userName: login,
                email: email,
                passwordHash: password,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate:
                    add(new Date(), {
                        hours: 1,
                        minutes: 3
                    }),
                isConfirmed: false
            }
        };

        const res = await userCollection.insertOne({...newUser})


        return {
            ...newUser
        }
    }
}