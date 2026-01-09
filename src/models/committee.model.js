import mongoose,{Schema} from "mongoose"

const committeeSchema = new Schema({

    name: {
        type:String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: false
    }

},{timestamps:true})

export const Committee = mongoose.model("Committee", committeeSchema)