import mongoose from "mongoose";
import { Schema } from "mongoose";

const gallerySchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: "Event"
    },
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    }
},{timestamps: true})

export const Gallery = mongoose.model("Gallery", gallerySchema)
