import mongoose, {Schema, model} from "mongoose";
import { IUser as UserType } from "../types";

const UserSchema = new Schema<UserType>({
    _id: {
        type: String || Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    ideal_trade_amount: {
        type: Number,
        required: true
    },
    keys: {
        api_key: {
            type: String,
            required: true
        },
        api_secret: {
            type: String,
            required: true
        }
    },
});

const User = mongoose.models.User || model<UserType>('User', UserSchema);

export default User;