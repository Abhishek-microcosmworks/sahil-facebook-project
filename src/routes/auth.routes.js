// import express from "express";
// import { register, login } from "../controllers/auth.controller.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// export default router;


import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import { registerValidation, loginValidation } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);

export default router;
