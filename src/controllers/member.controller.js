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

    const { userId } = req.body

    if(!userId) {
        throw new ApiError(400,"User ID is required")
    }

    const creator = await Member.findOne({ user: req.user._id })

    if(!creator) {
        throw new ApiError(403, "Not a committe member")
    }

    if(!["head"].includes(creator.role)) {
        throw new ApiError(403, "Not authorized to add members")
    }

    const committee = creator.committee

    const userExists = await User.findById(userId)

    if(!userExists) {
        throw new ApiError(404, "User does not exist");
    }

    const alreadyMember = await Member.findOne({
        user: userId,
        committee
    })

    if(alreadyMember) {
        throw new ApiError(409, "User is already a member of this committee");
    }

    const member = await Member.create({
        user: userId,
        committee,
        role: "member"
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            member,
            "Member Added Successfully"
        )
    )
})

const listCommitteeMembers = asyncHandler(async(req, res) => {

    // find which committee the logged in user belongs to
    // fetch all members of that committee
    // return details
    // only head and core can view members of the committee

    const requester = await Member.findOne({ user: req.user._id })

    if(!requester) {
        throw new ApiError(403, "You are not a committee member");
    }

    if (!["head", "core"].includes(requester.role)) {
        throw new ApiError(403, "Not authorized to view members");
    }

    const committee = requester.committee

    const members = await Member.find({ committee })
    .populate("user", "username email")
    .select("user role joinedAt createdAt")

    return res.status(200).json(
        new ApiResponse(200, members, "Committee members fetched successfully")
    );


})

export {
    createMember,
    listCommitteeMembers
}