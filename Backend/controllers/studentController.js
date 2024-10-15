const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");
const Student = require("../models/Student");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const {
  hashPassword,
  comparePassword,
  generateToken,
  generateOtp,
  sendEmail,
  checkEmailExists,
  checkIdExists,
  generateResetToken,
  isEnrollNumExists,
} = require("../utils/authUtils");

// Register student
exports.registerStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, studentId } = req.body;

  try {
    // Check if email already exists
    const emailCheck = await checkEmailExists(email);
    if (emailCheck.exists) {
      return res.status(400).json({ msg: "Student already exists" });
    }

    // Create new student
    const hashedPassword = await hashPassword(password);
    const student = new Student({
      name,
      email,
      password: hashedPassword,
      studentDetails: { studentId },
      registrationDate: new Date(),
    });
    await student.save();
    console.log("student: ", student);

    // Generate JWT token
    const payload = { user: { id: student.id, email: student.email } };
    const token = generateToken(payload, "1h");

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Login student
exports.loginStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res
        .status(400)
        .json({ email: "Invalid Credentials! Email is incorrect." });
    }

    // Check password
    const isMatch = await comparePassword(password, student.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ password: "Invalid Credentials! Password is incorrect." });
    }

    // Generate JWT token if student is active
    if (student.isActive) {
      const payload = {
        user: {
          id: student.studentDetails.studentId,
          email: student.email,
          name: student.name,
          role: "student",
        },
      };
      const token = generateToken(payload, "1h");

      res.cookie("token", token, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "strict",
      });

      return res.json({ msg: "Login successful", loginToken: token });
    }

    // Generate OTP if student is not active
    const otpToken = generateToken({ email }, "1h");
    student.lastToken = otpToken;
    student.otp = generateOtp().otp; // Generate OTP using utility function
    student.otpExpiration = generateOtp().otpExpiration;
    await student.save();

    // Send OTP email
    await sendEmail(
      student.email,
      "Your OTP Code",
      `Your OTP code is ${student.otp}. Please enter this code to complete your login process.`,
      `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; text-align: center; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <img src="./logo.svg" alt="Patshala Logo" style="width: 150px; margin-bottom: 20px;">
          <h1 style="font-size: 24px; color: #333;">Your OTP Code</h1>
          <p style="font-size: 16px; color: #666;">Dear Student,</p>
          <p style="font-size: 16px; color: #666;">Your OTP code is <strong>${student.otp}</strong>. Please enter this code to complete your login process.</p>
          <p style="font-size: 14px; color: #999;">Thanks,<br>The Patshala Team</p>
        </div>
        <p style="font-size: 12px; color: #999; margin-top: 20px;">This email was sent to you by Patshala. If you have any questions, please contact our support team.</p>
      </div>
      `
    );

    // Set OTP token in cookies
    res.cookie("studentVerifyToken", otpToken, {
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: "strict",
    });

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Check if email exists
exports.checkEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Check if the email exists in the Student or Teacher collections
    const emailCheck = await checkEmailExists(email);

    if (emailCheck.exists) {
      if (emailCheck.role === "teacher") {
        return res.status(409).json({
          message: "User already exists as a teacher, use a new email!",
          exists: true,
        });
      } else {
        return res.status(409).json({
          message: "User already exists, you can login!",
          exists: true,
        });
      }
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Check if enrollmentID exists
exports.checkEnrollmentID = async (req, res) => {
  const { studentId } = req.params;
  const { name } = req.query;

  try {
    const filePath = path.join(__dirname, "../StudentData.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const studentsData = JSON.parse(fileContent);

    // Check if the enrollment ID exists and if the name matches
    const idCheck = await checkIdExists(studentId);
    const enrollCheck = isEnrollNumExists(studentId, studentsData, name);
    console.log(idCheck);
    if (idCheck.exists) {
      if (idCheck.role === "teacher") {
        return res.status(409).json({
          message:
            "ID already exists as a teacher ID. Please use a different enrollment ID.",
          exists: true,
        });
      } else if (idCheck.role === "student") {
        return res.status(409).json({
          message:
            "ID already exists in database as a student ID. Please use a different enrollment ID.",
          exists: true,
        });
      }
    }
    if (enrollCheck.exists) {
      if (enrollCheck.message === "Enrollment number and name match.") {
        return res.json({
          message: "Enrollment number and name match. Proceed with login.",
          exists: true,
          proceed: true,
        });
      } else {
        // Name does not match, but enrollment exists
        return res.status(409).json({
          message: enrollCheck.message,
          exists: true,
          proceed: false,
        });
      }
    }

    // Enrollment ID does not exist
    return res.status(404).json({
      message: "Enrollment ID does not exist.",
      exists: false,
      proceed: false,
    });
  } catch (err) {
    console.error("Error checking enrollment ID:", err.message);
    return res.status(500).json({
      message: "Server error while checking enrollment ID.",
      error: err.message,
    });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ msg: "Student does not exist" });
    }

    // Generate reset token
    const { resetToken, hashedToken } = generateResetToken();
    student.resetPasswordToken = hashedToken;
    student.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await student.save();

    // Construct reset URL
    const resetUrl = `http://localhost:5173/student/reset-password/${resetToken}`;

    // Send email with reset link
    await sendEmail(
      student.email,
      "Reset Your Password",
      `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n
         Please click on the following link, or paste it into your browser to complete the process:\n\n
         ${resetUrl}\n\n
         If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; text-align: center; padding: 20px; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <img src="./logo.svg" alt="Patshala Logo" style="width: 150px; margin-bottom: 20px;">
      <h1 style="font-size: 24px; color: #333;">Reset Your Password</h1>
      <p style="font-size: 16px; color: #666;">Dear Student,</p>
      <p style="font-size: 16px; color: #666;">We received a request to reset the password for your Patshala account. Click the button below to reset it.</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p style="font-size: 14px; color: #999;">If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
      <p style="font-size: 14px; color: #999;">Thanks,<br>The Patshala Team</p>
    </div>
    <p style="font-size: 12px; color: #999; margin-top: 20px;">This email was sent to you by Patshala. If you have any questions, please contact our support team.</p>
  </div>
  `,
      `<!doctype html>
<html ⚡4email>
  <head>
    <meta charset="utf-8">
    <style amp4email-boilerplate>body{visibility:hidden}</style>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
  </head>
  <body>
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; text-align: center; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <img src="http://localhost:5173/public/logo.svg" alt="Patshala Logo" style="width: 150px; margin-bottom: 20px;">
        <h1 style="font-size: 24px; color: #333;">Reset Your Password</h1>
        <p style="font-size: 16px; color: #666;">Hi there,</p>
        <p style="font-size: 16px; color: #666;">We received a request to reset the password for your Patshala student account. Click the button below to reset it.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p style="font-size: 14px; color: #999;">If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p style="font-size: 14px; color: #999;">Thanks,<br>The Patshala Team</p>
      </div>
      <p style="font-size: 12px; color: #999; margin-top: 20px;">This email was sent to you by Patshala. If you have any questions, please contact our support team.</p>
    </div>
  </body>
</html>
`
    );

    res.status(200).json({ msg: "Email sent" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { resetToken, password } = req.body;

  try {
    // Hash the received reset token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const student = await Student.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!student) {
      return res.status(400).json({ msg: "Token is invalid or has expired" });
    }

    // Hash the new password
    student.password = await hashPassword(password);

    // Clear the reset token and expiration
    student.resetPasswordToken = undefined;
    student.resetPasswordExpires = undefined;

    await student.save();
    res.status(200).json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Check Reset Token
exports.checkResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    // Hash the token for comparison
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find student with the hashed token and check if it has not expired
    const student = await Student.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!student) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    res.status(200).json({ msg: "Valid token" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;

  // Check for the presence of the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).json({ msg: "Authorization header missing" });
  }

  // Ensure the Authorization header has the Bearer token format
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(400)
      .json({ msg: "Token missing from Authorization header" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    console.log(decoded.email);
    const student = await Student.findOne({ email: decoded.email });

    if (!student) {
      return res.status(400).json({ msg: "Student not found" });
    }

    // Check if the OTP is correct and has not expired
    if (student.otp === otp && student.otpExpiration > Date.now()) {
      // OTP is correct
      student.isActive = true; // Mark student as active
      student.otp = undefined; // Clear OTP
      student.otpExpiration = undefined; // Clear OTP expiration
      await student.save();

      // Generate JWT token
      const payload = {
        user: { id: student.id, email: student.email, role: "student" },
      };
      const newToken = generateToken(payload, "1h");

      // Send the new token in the response
      res.cookie("token", newToken, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "strict",
      });

      res
        .status(200)
        .json({ msg: "OTP verified successfully", token: newToken });
    } else {
      // OTP is incorrect or expired
      res.status(400).json({ msg: "Invalid or expired OTP" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Resend OTP
exports.resendOtp = async (req, res) => {
  // Check for the presence of the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).json({ msg: "Authorization header missing" });
  }

  // Ensure the Authorization header has the Bearer token format
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(400)
      .json({ msg: "Token missing from Authorization header" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    const email = decoded.email;

    if (!email) {
      return res.status(400).json({ msg: "JWT expired or invalid" });
    }

    // Find the student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ msg: "User not found" });
    }

    const currentTime = Date.now();
    const otpExpiresAt = student.otpExpiration || new Date(0);

    // Check if the existing OTP has expired
    if (currentTime < otpExpiresAt) {
      return res.status(400).json({
        msg: "An OTP has already been sent. Please wait for it to expire before requesting a new one.",
      });
    }

    // Generate and save new OTP
    student.otp = generateOtp().otp; // Generate OTP using utility function
    student.otpExpiration = generateOtp().otpExpiration;
    await student.save();

    await sendEmail(
      student.email,
      "Your OTP Code",
      `Your OTP code is ${student.otp}. Please enter this code to complete your login process.`,
      `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; text-align: center; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <img src="./logo.svg" alt="Patshala Logo" style="width: 150px; margin-bottom: 20px;">
            <h1 style="font-size: 24px; color: #333;">Your OTP Code</h1>
            <p style="font-size: 16px; color: #666;">Hi there,</p>
            <p style="font-size: 16px; color: #666;">Your OTP code is <strong>${student.otp}</strong>. Please enter this code to complete your login process.</p>
            <p style="font-size: 14px; color: #999;">Thanks,<br>The Patshala Team</p>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">This email was sent to you by Patshala. If you have any questions, please contact our support team.</p>
        </div>
      `
    );

    res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ msg: "Token Expired! Please relogin!" });
    }
    // Generic server error
    return res.status(500).send("Server error");
  }
};
