import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    committee: {
      type: Schema.Types.ObjectId,
      ref: "Committee",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    poster: {
      type: String,
      required: true,
    },

    registrationLink: {
      type: String,
      match: [/^https?:\/\/.+/, "Invalid registration URL"],
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    location: {
      type: String,
      trim: true,
    },

    eventType: {
      type: String,
      enum: ["technical", "cultural", "workshop", "seminar", "sports"],
      required: true,
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },

    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
