import {body, param, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";
import {ResultStatus} from "../common/types/resultCode";
import {authService, blogsRepository, usersQueryRepository} from "../composition-root";
import {CustomRateLimitDB} from "../input-output-types/inputOutputTypesMongo";
import {CustomRateLimitModel} from "../db/mongo/customRateLimit/customRateLimit.model";

export const inputValidationMiddleware = (req:Request, res: Response, next: NextFunction): any => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({errorsMessages: errors.array().map((e: any) => {return {field: e.path, message: e.msg}})});
        return;
    } else {
        next();
    }
}

export const inputValidationMiddlewareBlogID = (req:Request, res: Response, next: NextFunction): any => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(404).json({errorsMessages: errors.array().map((e: any) => {return {field: e.path, message: e.msg}})});
        return;
    } else {
        next();
    }
}

export const postInputValidatorBlogID =
    [
        param('blogId').custom(async (blogId) => {

            if (!ObjectId.isValid(blogId)) {
                throw new Error('Blog ID is not valid')
            }
            if (blogId) {
                const foundBlog = await blogsRepository.findById(new ObjectId(blogId));
                if (!foundBlog) {
                    throw new Error('Blog not found')
                }
            }
        }),
    ]

export const postInputValidatorBlog =
    [
        body('name').trim().isLength({min: 3, max: 15}).withMessage('Name should be from 3 to 15'),
        body('description').trim().isLength({min: 1, max: 500}).withMessage('Name should be from 1 to 500'),
        body('websiteUrl').isURL().withMessage('Is not URL'),

    ]

export const postInputValidatorPost =

    [
        body('title').trim().isLength({min: 3, max: 30}).withMessage('Field should be from 3 to 30'),
        body('shortDescription').trim().isLength({min: 1, max: 100}).withMessage('Field should be from 1 to 100'),
        body('content').trim().isLength({min: 1, max: 1000}).withMessage('Field should be from 1 to 1000'),
        body('blogId').custom(async value => {
            if (!ObjectId.isValid(value)) {
                throw new Error('Blog ID is not valid')
            }
            if(value) {
            const foundBlog = await blogsRepository.findById(new ObjectId(value))
            if(!foundBlog) {
                throw new Error('Blog not found')
            }}
        })

    ]

export const postInputValidatorPostWithoutBlogID =

    [
        body('title').trim().isLength({min: 3, max: 30}).withMessage('Field should be from 3 to 30'),
        body('shortDescription').trim().isLength({min: 1, max: 100}).withMessage('Field should be from 1 to 100'),
        body('content').trim().isLength({min: 1, max: 1000}).withMessage('Field should be from 1 to 1000'),

    ]
const ADMIN_AUTH_BASE64 = 'Basic YWRtaW46cXdlcnR5';
export const authMiddleware = (req:Request, res: Response, next: NextFunction) => {

    if(!req.headers['authorization']) {
        res.sendStatus(401);
        return;
    } else {
        const auth: string = req.headers['authorization'];
        if(auth !== ADMIN_AUTH_BASE64){
            res.sendStatus(401);
            return;
        }

        next();
    }
}

export const authMiddlewareBearer = async (req:Request, res: Response, next: NextFunction) => {

    if(!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    const result = await authService.checkAccessToken(req.headers.authorization);

    if(result.status === ResultStatus.Success){
        req.userId = result.data!.toString();
        return next();
    }

    return res.sendStatus(401);
}

export const getUserIdWithoutAuth = async (req:Request, res: Response, next: NextFunction) => {

    if(!req.headers.authorization) {

        return next();
    }
    const result = await authService.checkAccessToken(req.headers.authorization);

    if(result.status === ResultStatus.Success){
        req.userId = result.data!.toString();
        return next();
    }

}

export const authMiddlewareRefreshToken = async (req:Request, res: Response, next: NextFunction) => {

    if(!req.cookies) {
        res.sendStatus(401);
        return;
    }

    if(!req.cookies.refreshToken) {
        res.sendStatus(401);
        return;
    }

    const result = await authService.checkRefreshToken(req.cookies.refreshToken)

    if(result.status === ResultStatus.Success){
        req.userId = result.data!.userId.toString();
        req.deviceId = result.data!.deviceId!.toString();
        return next();
    }

    return res.sendStatus(401);

}

export const emailInputValidator =
    [
        body('email').isEmail().withMessage('Invalid email'),
        // body('email').custom(async value => {
        //     const user = await userQueryRepository.findByLoginOrEmail(value)
        //         // await userQueryRepository.getCountDocumentWithFilter(undefined, value);
        //     if (!user ) {
        //         throw new Error('user email doesnt exist')
        //     }
        // })
    ]
export const userInputValidator =

    [
        body('login').trim().isLength({min: 3, max: 10}).matches(/^[a-zA-Z0-9_-]*$/).withMessage('Field should be from 3 to 30'),
        body('password').trim().isLength({min: 6, max: 20}).withMessage('Field should be from 6 to 20'),
        body('email').isEmail().withMessage('Invalid email'),
        body('login').custom(async value => {
            const countDocuments = await usersQueryRepository.getCountDocumentWithFilter(value, undefined);
            if (countDocuments > 0) {
                throw new Error('login is not unique')
            }
        })
        ,
        body('email').custom(async value => {
            const countDocuments = await usersQueryRepository.getCountDocumentWithFilter(undefined, value);
            if (countDocuments > 0 && value.length>0) {
                throw new Error('email is not unique')
            }
        })
    ]

export const userNewPasswordValidator =

    [
        body('newPassword').trim().isLength({min: 6, max: 20}).withMessage('Field should be from 6 to 20'),
    ]
export const commentInputValidator =

    [
        body('content').trim().isLength({min: 20, max: 300}).withMessage('Content should be from 20 to 300'),
    ]

export const apiRequestLimitMiddleware = async (req:Request, res: Response, next: NextFunction) => {

    const currentDate = new Date();

    const date = new Date(Date.now()-10000)

    const apiInformation = new CustomRateLimitDB(
        req.ip!,
        req.originalUrl,
        currentDate
    )

    let newCustomRateLimit = new CustomRateLimitModel(apiInformation)

    await newCustomRateLimit.save()

    const filterCustomRate = {
        IP: req.ip,
        URL: req.originalUrl,
        date: {$gte: date}
    }
    const countCustomRate = await CustomRateLimitModel.countDocuments(filterCustomRate);

    if(countCustomRate > 5) {
        res.sendStatus(429);
        return;
    }

    return next();

}