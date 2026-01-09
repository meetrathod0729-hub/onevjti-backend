import mongoose,{Schema} from "mongoose"

const memberSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    role: {
        type: String,
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    committee: {
        type: Schema.Types.ObjectId,
        ref: "Committee"
    }

},{timestamps:true})

export const Member = mongoose.model("Member", memberSchema)