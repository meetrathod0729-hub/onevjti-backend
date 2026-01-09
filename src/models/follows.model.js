import mongoose,{Schema} from "mongoose"

const followsSchema=new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    committee:{
        type: Schema.Types.ObjectId,
        ref: 'Committee'
    }
},{timestamps: true})

export const Follows=mongoose.model('Follows',followsSchema)