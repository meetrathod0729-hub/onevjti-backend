import mongoose, {Schema} from "mongoose"

const eventRegistrationSchema=new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    registeredAt:{
        type: Date,
        default: Date.now
    },
    event:{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }
},{timestamps: true})

export const EventRegistration=mongoose.model('EventRegistration',eventRegistrationSchema )