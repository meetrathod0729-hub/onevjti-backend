import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Event } from "../models/event.model.js";
import { Member } from "../models/member.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { Committee } from "../models/committee.model.js";
import { User } from "../models/user.model.js";

const createCommittee = asyncHandler(async(req, res) => {
    const {name, description, headUserId} = req.body


    if(!name || !description || !headUserId) {
        throw new ApiError(400, "Committee name and head required")
    }

    const existsUser = await User.findById(headUserId)

    if(!existsUser) {
        throw new ApiError(404, "User not found")
    }

    const committee = await Committee.create({
        name,
        description,
        // logo: logo?.url
    })

    await Member.create({
        user: headUserId,
        committee: committee._id,
        role: "head"
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            committee,
            "Comittee created with Head"
        )
    )
})

export {
    createCommittee
}