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

    const logoLocalPath = req.file?.path
    let logoUrl

    if(logoLocalPath) {
        const logo = await uploadOnCloudinary(logoLocalPath)

        if(!logo) {
            throw new ApiError(400, "Logo upload failed")
        }

        logoUrl = logo.url

    }

    const committee = await Committee.create({
        name,
        description,
        logo: logoUrl
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

const getAllCommittees = asyncHandler(async(req, res) => {
    const committees = await Committee.find()
    .select("name description logo")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            committees,
            "Committees fetched"
        )
    )
})

const updateCommittee = asyncHandler(async(req, res) => {
    const {name, description, committeeId} = req.body

    if(!name || !description) {
        throw new ApiError(400, "All fields are required")
    }

    if(!committeeId) {
        throw new ApiError(400, "Committee ID is required");
    }

    const logoLocalPath = req.file?.path
    let logoUrl

    if(logoLocalPath) {
        const logo = await uploadOnCloudinary(newLogoLocalPath)

        if(!logo) {
            throw new ApiError(400, "Logo upload failed")
        }

        logoUrl = logo.url

    }

    const updateCommittee = await Committee.findByIdAndUpdate(
        committeeId,
        {
            $set: {
                name,
                description,
                logoUrl,
            }
        },
        {
            new: true
        }
    )

    return res.status(200).json(
        new ApiResponse(200, updatedCommittee, "Committee updated successfully")
    );

})

export {
    createCommittee,
    getAllCommittees,
    updateCommittee
}