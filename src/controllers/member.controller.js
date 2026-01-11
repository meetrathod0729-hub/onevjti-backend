import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Event } from "../models/event.model.js";
import { Member } from "../models/member.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { Committee } from "../models/committee.model.js";
import { User } from "../models/user.model.js";

const createMember = asyncHandler(async(req,res) => {
    const creator = await Member.findById(req.user._id)

    if(!creator) {
        throw new ApiError(403, "Not a committe member")
    }

    if(!["head"].includes(creator.role)) {
        throw new ApiError(403, "Not authorized to add members")
    }

    const comittee = creator.comittee

    const member = await Member.create({
        user: newUserId,
        comittee,
        role: "member"
    })
})

export {
    createMember
}