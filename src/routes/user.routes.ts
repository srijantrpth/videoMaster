import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
// Controllers
import { registerUser } from "../controllers/user.controller.js";

// Validation Middleware
import { validateData } from "../middlewares/validation.middleware.js";

// Schemas
import { userRegistrationSchema } from "../schemas/userSchemas.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  validateData(userRegistrationSchema),

  registerUser,
);
export default router;
