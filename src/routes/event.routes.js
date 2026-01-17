import { Router } from "express";
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from "../controllers/event.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"


const router = Router()


router.route("/").post(verifyJWT,
    upload.fields([
        {
            name: "poster",
            maxCount: 1
        }
    ])
    ,createEvent)
router.route("/").get(getAllEvents)
router.route("/:eventId").get(getEventById)
router.route("/:eventId").patch(verifyJWT,updateEvent)
router.route("/:eventId").delete(verifyJWT,deleteEvent)

export default router