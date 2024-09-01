const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const studentController = require("../controllers/studentController");

// Student Registration
router.post(
  "/register",
  [
    check("name", "Please enter a name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("studentId", "Please enter a enrollment ID").not().isEmpty(),
  ],
  studentController.registerStudent
);

// Student Login
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  studentController.loginStudent
);

// Check if email exists
router.get("/check-email/:email", studentController.checkEmail);

// Check if student ID exists
// router.get("/check-enrollmentID/:enrollmentID", studentController.checkEnrollmentID);
router.get("/check-studentId/:studentId", studentController.checkEnrollmentID);

// Forgot Password
router.post(
  "/forgot-password",
  [check("email", "Please include a valid email").isEmail()],
  studentController.forgotPassword
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
  studentController.resetPassword
);
router.get("/check-reset-token/:token", studentController.checkResetToken);

router.post("/verify-otp", studentController.verifyOtp);
router.post("/resend-otp", studentController.resendOtp);

module.exports = router;
