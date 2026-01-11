import mongoose,{Schema} from "mongoose"

const memberSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role: {
        type: String,
        enum: ["member", "core", "head"],
        default: "member",
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    committee: {
        type: Schema.Types.ObjectId,
        ref: "Committee",
        required: true
    }

},{timestamps:true})

export const Member = mongoose.model("Member", memberSchema)