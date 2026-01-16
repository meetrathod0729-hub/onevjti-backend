import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Achievement } from "../models/achievement.model.js";
import { Member } from "../models/member.model.js";
import { Committee } from "../models/committee.model.js";

const addAchievement=asyncHandler(async(req,res)=>{
    const { committeeId }=req.params
    if(!committeeId){
        throw new ApiError(400, "Committee ID is required")
    }
    const {
        title,
        description,
        contestDate,
        winners 
    } = req.body;

    if(!title){
        throw new ApiError(400, "Title is required") 
    }
    if(!description){
        throw new ApiError(400, "Description is required")
    }

    const committe=await Committee.findById(committeeId)
    if(!committe){
        throw new ApiError(404, "Committee not found")
    }

    const member = await Member.findOne({ 
        user: req.user._id ,
        committee: committeeId
    });
    if(!member) {
        throw new ApiError(403, "User is not part of any committee");
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

const deleteAchievement=asyncHandler(async(req,res)=>{
    const { achievementId } = req.params
    if(!achievementId){
        throw new ApiError(400, "Achievement ID is required")
    }

    const achievement=await Achievement.findById(achievementId)
    if(!achievement){
        throw new ApiError(404, 'Achievement not found')
    }

    const member=await Member.findOne({
        user: req.user._id,
        committee: achievement.committee
    })

    if(!member){
        throw new ApiError(403, "You are NOT authorized to delete this achievement")
    }

    await Achievement.findByIdAndDelete(achievementId);

    return res.status(200).json(
        new ApiResponse(200, null, "Achievement deleted successfully")
    )

})

export {
    addAchievement,
    getAchievement,
    deleteAchievement
}