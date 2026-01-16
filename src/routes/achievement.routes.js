import { Router } from express;
import { addAchievement, getAchievement, deleteAchievement } from "../controllers/achievement.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/achievements/:committeeId").post(
    verifyJWT,
    addAchievement
)

router.route("/achievements/:committeeId").get(getAchievement)

router
    .route("/achievements/:achievementId")
    .delete(verifyJWT, deleteAchievement)

export default router