import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Achievement } from "../models/achievement.model.js";
import { Member } from "../models/member.model.js";
import { Committee } from "../models/committee.model.js";

const addAchievement=asyncHandler(async(req,res)=>{
    const { committeeId } = req.params
    const {
        title,
        description,
        contestDate,
        winners 
    } = req.body;


    if(!title || !description){
        throw new ApiError(400, "Required Fields are not filled") 
    }
    const requester = await Member.findOne({ user : req.user._id })
    
    if(!requester) {
            throw new ApiError(403, "Unauthorized Access")
        }
    
    if(!["head","core"].includes(requester.role)) {
            throw new ApiError(403, "Must me a head or core member of the committee")
    }
    if(!committeeId){
        throw new ApiError(400, "Committee ID is required")
    }
    const committee = await Committee.findById(committeeId)

    if(!committee){
        throw new ApiError(404, "Committee not found")
    }

    if(
        requester.committee.toString() !== committee._id.toString()
    ) {
        throw new ApiError(403, "Unauthorized Access")
    }


    const achievements=await Achievement.create({
        committee: committeeId,
        title,
        description,
        contestDate,
        winners
    })

    return res.status(201).json(
        new ApiResponse(201, achievements, "Achievement added successfully")
    );
})

const getAchievement=asyncHandler(async(req,res)=>{
    const { committeeId }=req.params
    if(!committeeId){
        throw new ApiError(400, "Committee ID is required")
    }

    const committee=await Committee.findById(committeeId)
    if(!committee){
        throw new ApiError(404, "Committee not found")
    }

    const achievementsFound=await Achievement.find({ committee: committeeId }).sort({createdAt: -1})
    return res.status(200).json(
        new ApiResponse(200, achievementsFound, "Achievements found successfully")
    )
})

const deleteAchievement = asyncHandler(async (req, res) => {
    const { achievementId } = req.params;

    if (!achievementId) {
        throw new ApiError(400, "Achievement ID is required");
    }

    const requester = await Member.findOne({ user: req.user._id });

    if (!requester) {
        throw new ApiError(403, "Not a committee member");
    }

    if (!["head", "core"].includes(requester.role)) {
        throw new ApiError(403, "Only head or core members can delete achievements");
    }

    const achievement = await Achievement.findById(achievementId);

    if (!achievement) {
        throw new ApiError(404, "Achievement not found");
    }

    if (
        achievement.committee.toString() !==
        requester.committee.toString()
    ) {
        throw new ApiError(403, "Unauthorized access");
    }

    await achievement.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Achievement deleted successfully"
        )
    );
});

export {
    addAchievement,
    getAchievement,
    deleteAchievement
}