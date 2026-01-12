import { Router } from "express";
import { createCommittee } from "../controllers/committee.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()
router.use(verifyJWT) // aply login to all who plays with committee
router.post(
    "/",
    upload.single("logo"),
    createCommittee
);


export default router