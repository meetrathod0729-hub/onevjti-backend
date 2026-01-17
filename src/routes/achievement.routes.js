import { Router } from "express";
import { addAchievement, getAchievement, deleteAchievement } from "../controllers/achievement.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/:committeeId").post(
    verifyJWT,
    addAchievement
)

router.route("/:committeeId").get(getAchievement)

router
    .route("/:achievementId")
    .delete(verifyJWT, deleteAchievement)

export default router