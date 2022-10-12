import mongoose, {Schema, model} from "mongoose";
import { BotConfig as ConfigType } from "../types";

const ConfigSchema = new Schema<ConfigType>({
    pair: {
        type: String,
        required: true
    },
    strategy: {
        type: String,
        required: true
    },
    operation_expiry_time: {
        type: Number,
        required: true
    },
    cci_peak: {
        type: Number,
        required: true
    },
    stop_loss: {
        type: Number,
        required: true
    },
    take_profit: {
        type: Number,
        required: true
    },
    position_structure: {
        type: String,
        required: true
    },
    start_gap_percentage: {
        type: Number,
        required: true
    },
    max_weight_allocation: {
        type: Number,
        required: true
    },
    leverage: {
        type: Number,
        required: true
    }
});

const Config = mongoose.models.Config || model<ConfigType>('Config', ConfigSchema);

export default Config;