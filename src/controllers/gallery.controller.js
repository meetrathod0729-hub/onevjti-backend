import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Gallery } from "../models/gallery.model.js";
import { Event } from "../models/event.model.js";

const addGalleryItem=asyncHandler(async(req, res)=>{

    const { eventId } = req.params
    const { caption }= req.body

    if(!eventId){
        throw new ApiError(400, "Event ID is required")
    }

    if(!caption){
        throw new ApiError(400, "Caption is required")
    }

    const requester = await Member.findOne({ user : req.user._id })

    if(!requester) {
        throw new ApiError(403, "Unauthorized Access")
    }

    if(!["head","core"].includes(requester.role)) {
        throw new ApiError(403, "Must me a head or core member of the committee")
    }

    const event = await Event.findById(eventId)

    if(!event) {
        throw new ApiError(404, "Event not found")
    }

    if(
        event.committee.toString() !== 
        requester.committee.toString()
    ) {
        throw new ApiError(403,"Unauthorized Access")
    }

    
    const imgLocalPath=req.file?.path

    if(!imgLocalPath){
        throw new ApiError(400, "No image uploaded")  
    }

    const uploadedImage = await uploadOnCloudinary(imgLocalPath)

    if(!uploadedImage){
        throw new ApiError(500, "Failed to upload image") 
    }

    const galleryImageUpload = await Gallery.create({
        event: eventId,
        image:uploadedImage.url,
        caption
    })

    return res.status(201).json(
        new ApiResponse(201, galleryImageUpload, "Image uploaded successfully.")
    )

})

const getGalleryItems=asyncHandler(async(req,res)=>{
    const { eventId } = req.params;

    if (!eventId) {
        throw new ApiError(400, "Event ID is required");
    }

    const galleryItems = await Gallery.find({ event: eventId })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, galleryItems, "Gallery items fetched successfully")
    );
})

const deleteGalleryItem = asyncHandler(async (req, res) => {
    const { galleryId } = req.params;

    if (!galleryId) {
        throw new ApiError(400, "Gallery ID is required");
    }

    const requester = await Member.findOne({ user : req.user._id })

    if(!requester) {
        throw new ApiError(403, "Unauthorized Access")
    }

    if(!["head","core"].includes(requester.role)) {
        throw new ApiError(403, "Must me a head or core member of the committee")
    }

    const galleryItem = await Gallery.findById(galleryId);

    if (!galleryItem) {
        throw new ApiError(404, "Gallery item not found");

    }

    const event = await Event.findById(galleryItem.event);

    if (!event) {
        throw new ApiError(404, "Associated event not found");
    }

    if (
        event.committee.toString() !==
        requester.committee.toString()
    ) {
        throw new ApiError(403, "Unauthorized access");
    }

    await galleryItem.deleteOne()

    return res.status(200).json(
        new ApiResponse(200, {}, "Gallery item deleted successfully")
    );
});

export {
    addGalleryItem,
    getGalleryItems,
    deleteGalleryItem
}