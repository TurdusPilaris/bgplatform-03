import *as mongoose from "mongoose";
import { WithId} from "mongodb";
import {Model, model, HydratedDocument} from "mongoose";

import {CustomRateLimitType} from "../../../input-output-types/common/common-types";

type CustomRateLimitModel = Model<WithId<CustomRateLimitType>>

export type CustomRateLimitDocument = HydratedDocument<WithId<CustomRateLimitType>>

export const CustomRateLimitSchema = new mongoose.Schema<WithId<CustomRateLimitType>>({
    IP: {type: String},
    URL: {type: String},
    date: {type: Date}
})

export const CustomRateLimitModel = model<WithId<CustomRateLimitType>, CustomRateLimitModel>('customRateLimit', CustomRateLimitSchema);