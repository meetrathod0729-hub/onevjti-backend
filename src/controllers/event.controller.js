import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Event } from "../models/event.model.js";
import { Member } from "../models/member.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


const createEvent = asyncHandler(async(req, res) => {
    const {
        title,
        description,
        registrationLink,
        location,
        eventType,
        startDate,
        endDate,
    } = req.body;
    
    if (!title || !description || !eventType || !startDate) {
        throw new ApiError(400, "Required fields are missing");
    }

    const member = await Member.findOne({ user: req.user._id });

    if(!member) {
        throw new ApiError(403, "User is not part of any committee");
    }

    if (!["core", "head"].includes(member.role)) {
        throw new ApiError(403, "Not authorized to create events");
    }

    const committee = member.committee

    const posterLocalPath =
        req.files &&
            req.files.poster &&
            req.files.poster.length > 0
            ? req.files.poster[0].path
            : null;

    if(!posterLocalPath) {
        throw new ApiError(400, "Poster is required!")
    }

    const poster = await uploadOnCloudinary(posterLocalPath)

    if(!poster) {
        throw new ApiError(400, "Poster upload failed");
    }

    const event = await Event.create({
        title,
        description,
        poster: poster.url,
        registrationLink,
        location,
        eventType,
        startDate,
        endDate,
        createdBy: req.user._id,
        committee
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            event,
            "Event Created Successfully!"
        )
    )
})

const getAllEvents = asyncHandler(async(req, res) => {

    const {committee, eventType, upcoming} = req.query

    const filter = {}

    if(committee) {
        filter.committee = committee
    }

    if(eventType) {
        filter.eventType = eventType
    }

    if(upcoming == "true") {
        filter.startDate = { $gte: new Date() }
    }

    const events = await Event.find(filter)
    .populate("committee", "name logo")
    .populate("createdBy", "username fullName")
    .sort({ startDate: 1 })

    return res.status(200).json(
        new ApiResponse(
            200,
            events,
            "Events fetched successfully"
        )
    );

})


export {
    createEvent,
    getAllEvents,
    getEventById
}