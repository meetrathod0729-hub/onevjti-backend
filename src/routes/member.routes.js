import { Router } from "express";
import { createMember, listCommitteeMembers } from "../controllers/member.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()
router.use(verifyJWT) // aply login to all who plays with events

router.route("/").post(createMember)
router.route("/").get(listCommitteeMembers)

export default router