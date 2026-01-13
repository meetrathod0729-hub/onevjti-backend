import { Router } from "express";
import { createMember, listCommitteeMembers, removeMember, updateMemberRole } from "../controllers/member.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()
router.use(verifyJWT) 

router.route("/").post(createMember)
router.route("/").get(listCommitteeMembers)
router.route("/:memberId").delete(removeMember)
router.route("/:memberId/role").patch(updateMemberRole)

export default router