const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const teacherController = require("../controllers/teacherController");

// Teacher Registration
router.post(
  "/register",
  [
    check("name", "Please enter a name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("teacherId", "Please enter a teacher ID").not().isEmpty(),
    check("subjects", "Please include at least one subject").isArray({
      min: 1,
    }),
  ],
  teacherController.registerTeacher
);

// Teacher Login
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  teacherController.loginTeacher
);

// Check if email exists
router.get("/check-email/:email", teacherController.checkEmail);

// Check if teacher ID exists
router.get("/check-teacherId/:teacherId", teacherController.checkEnrollmentID);

// Forgot Password
router.post(
  "/forgot-password",
  [check("email", "Please include a valid email").isEmail()],
  teacherController.forgotPassword
);

// Reset Password
router.post(
  "/reset-password/:token",
  [
    check("resetToken", "Token is required").exists(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  teacherController.resetPassword
);

router.get("/check-reset-token/:token", teacherController.checkResetToken);
router.post("/verify-otp", teacherController.verifyOtp);
router.post("/resend-otp", teacherController.resendOtp);
module.exports = router;
