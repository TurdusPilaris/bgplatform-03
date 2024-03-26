import dotenv from 'dotenv'
dotenv.config()

export const SETTING = {
    PORT : 3000,

    MONGO_URL: process.env.MONGO_URL || '',
    DB_NAME: process.env.DB_NAME || '',
    BLOG_COLLECTION_NAME:process.env.BLOG_COLLECTION_NAME|| '',
    POST_COLLECTION_NAME:process.env.POST_COLLECTION_NAME|| '',
    USER_COLLECTION_NAME:process.env.USER_COLLECTION_NAME|| '',
    USER_ACCOUNT_COLLECTION_NAME:process.env.USER_ACCOUNT_COLLECTION_NAME|| '',
    AUTH_COLLECTION_NAME:process.env.AUTH_COLLECTION_NAME|| '',
    BLACK_LIST_COLLECTION_NAME:process.env.BLACK_LIST_COLLECTION_NAME|| '',
    COMMENT_COLLECTION_NAME:process.env.COMMENT_COLLECTION_NAME|| '',
    PATH_BLOGS:'/blogs',
    PATH_POSTS:'/posts',
    PATH_USERS:'/users',
    PATH_AUTH:'/auth',
    PATH_TESTING:'/testing',
    PATH_COMMENT:'/comments',
    JWT_SECRET:process.env.JWT_SECRET|| '123',
    JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET|| '456',
    AC_TIME:process.env.AC_TIME|| '10s',
    AC_REFRESH_TIME:process.env.AC_REFRESH_TIME|| '20s',
    PASSWORD_FOR_EMAIL:process.env.PASSWORD_FOR_EMAIL||'',
}