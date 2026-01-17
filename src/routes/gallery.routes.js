import { Router } from "express";
import { addGalleryItem, getGalleryItems, deleteGalleryItem } from "../controllers/gallery.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/:eventId").post(
    verifyJWT,
    upload.single("image"),
    addGalleryItem
)

router.route("/:eventId").get(getGalleryItems)

router.route("/:galleryId")
.delete(
    verifyJWT,
    deleteGalleryItem
)

export default router;


