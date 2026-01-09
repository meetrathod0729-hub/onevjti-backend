import mongoose,{Schema} from "mongoose"

const achievementSchema=new Schema({
    committee:{
        type: Schema.Types.ObjectId,
        ref: 'Committee'
    },
    title:{
        type: String,
        required: true
    },
    decription:{
        type: String,
        required: true
    },
    contestDate:{
        type: Date
    },
    winners:{
        type: String,
    }
},{timestamps: true})

export const Achievement=mongoose.model('Achievement',achievementSchema)