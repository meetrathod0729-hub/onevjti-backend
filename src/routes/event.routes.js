import { Router } from "express";
import { createEvent } from "../controllers/event.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()
router.use(verifyJWT) // aply login to all who plays with events

router.route("/").post(createEvent)

export default router