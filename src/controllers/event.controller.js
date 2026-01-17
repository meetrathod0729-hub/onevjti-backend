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

    let posterUrl;

    if (posterLocalPath) {
    const uploadedPoster = await uploadOnCloudinary(posterLocalPath);

    if (!uploadedPoster) {
        throw new ApiError(400, "Poster upload failed");
    }

    posterUrl = uploadedPoster.url;
    }



    const event = await Event.create({
        title,
        description,
        registrationLink,
        location,
        eventType,
        startDate,
        endDate,
        poster: posterUrl,
        createdBy: req.user._id,
        committee,
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

const getEventById = asyncHandler(async(req,res) => {
    const { eventId } = req.params

    if(!eventId) {
        throw new ApiError(400, "Event Id is required")
    }

    const event = await Event.findById(eventId)
    .populate("committee", "name logo")
    .populate("createdBy", "username fullName")

    if(!event) {
        throw new ApiError(404, "No such event exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            event,
            "Event fetched successfully"
        )
    )
})

const updateEvent = asyncHandler(async(req,res) => {
    const { eventId } = req.params

    const {
        title,
        description,
        registrationLink,
        location,
        eventType,
        startDate,
        endDate,
    } = req.body || {};

    if(!eventId) {
        throw new ApiError(400, "Event ID is required");
    }

    const requester = await Member.findOne({user: req.user._id})

    if (!requester) {
        throw new ApiError(403, "Not a committee member");
    }

    if(!["head","core"].includes(requester.role)) {
        throw new ApiError(403, "Not authorized to update events")
    }

    const event = await Event.findById(eventId)

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if (
        event.committee.toString() !==
        requester.committee.toString()
    ) {
        throw new ApiError(403, "Unauthorized access");
    }

    const posterLocalPath = req.file?.path
    let posterUrl;

    if(posterLocalPath)
    {
        const poster = await uploadOnCloudinary(posterLocalPath)
        
        if(!poster?.url) {
            throw new ApiError(400, "Poster upload failed")
        }

        posterUrl = poster.url
    }

    const updateData = {}

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (registrationLink) updateData.registrationLink = registrationLink;
    if (location) updateData.location = location;
    if (eventType) updateData.eventType = eventType;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;
    if (posterUrl) updateData.poster = posterUrl;

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No fields provided for update");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        {
            $set: updateData
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedEvent,
            "Event Updated Successfully"
        )
    )

})

const deleteEvent = asyncHandler(async(req, res) => {
    const { eventId } = req.params

    if(!eventId) {
        throw new ApiError(400, "Event ID is required");
    }

    const requester = await Member.findOne({user: req.user._id})

    if (!requester) {
        throw new ApiError(403, "Not a committee member");
    }

    if(requester.role !== "head") {
        throw new ApiError(403, "Only Head can delete events")
    }

    const event = await Event.findById(eventId)

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if (
        event.committee.toString() !==
        requester.committee.toString()
    ) {
        throw new ApiError(403, "Unauthorized access");
    }

    await Event.findByIdAndDelete(eventId)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            eventId,
            "Event deleted successfully"
        )
    )
})

export {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
}