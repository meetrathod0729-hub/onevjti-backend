import mongoose, {Schema} from "mongoose"

const eventSchema = new Schema({

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    committee: {
        type: Schema.Types.ObjectId,
        ref:"Committee"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    posterUrl: {
        type: String,
        required: true,
    },
    registrationLink: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date, 
        required: false
    },
    location: {
        type: String
    },
    eventType: {
        type: String
    }



},{timestamps: true})

export const Event = mongoose.model("Event", eventSchema)