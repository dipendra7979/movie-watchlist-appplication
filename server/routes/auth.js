import express from "express";
import {
  login,
  sendOtp,
  verifyOtp,
  register,
  googleLogin,
} from "../controllers/auth.js";

const authRoutes = express.Router();

/*user authentication */
authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/sendotp", sendOtp);
authRoutes.post("/verifyotp", verifyOtp);
authRoutes.post("/googlelogin", googleLogin);

export default authRoutes;
