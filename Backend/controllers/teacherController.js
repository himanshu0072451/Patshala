const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const {
  hashPassword,
  comparePassword,
  generateToken,
  generateOtp,
  sendEmail,
  checkEmailExists,
  checkIdExists,
  generateResetToken,
} = require("../utils/authUtils");

// Register a new teacher
exports.registerTeacher = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, teacherId } = req.body;

  try {
    // Check if email already exists
    const emailCheck = await checkEmailExists(email);

    if (emailCheck.exists) {
      return res.status(400).json({ msg: "Teacher already exists" });
    }

    // Create new teacher
    const hashedPassword = await hashPassword(password);
    const teacher = new Teacher({
      name,
      email,
      password: hashPassword,
      teacherDetails: { teacherId },
      registrationDate: new Date(),
    });

    // Save the teacher
    await teacher.save();

    // Generate JWT token
    const payload = {
      user: {
        id: teacher.id,
        email: teacher.email,
      },
    };
    const token = generateToken(payload, "1h"); // 1-hour expiration

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Login teacher
exports.loginTeacher = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find teacher by email
    let teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res
        .status(400)
        .json({ email: "Invalid Credentials! Email is incorrect." });
    }

    // Check password
    const isMatch = await comparePassword(password, teacher.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ password: "Invalid Credentials! Password is incorrect." });
    }
    if (teacher.isActive) {
      const payload = {
        user: {
          id: teacher.id,
          email: teacher.email,
          role: "teacher",
        },
      };
      const token = generateToken(payload, "30d"); // 30 days

      res.cookie("token", token, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "strict",
      });
      return res.json({ msg: "isActive: true!", loginToken: token });
    }

    // Generate OTP if student is not active
    const otpPayload = { email };
    const otpToken = generateToken(otpPayload, "1h"); // 1 hour

    teacher.lastToken = otpToken;
    teacher.otp = generateOtp().otp;
    teacher.otpExpiration = generateOtp().otpExpiration;
    await teacher.save();

    // Send OTP email
    await sendEmail(
      teacher.email,
      "Your OTP Code",
      `Your OTP code is ${teacher.otp}. Please enter this code to complete your login process.`,
      `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; text-align: center; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <img src="./public/logo.svg" alt="Patshala Logo" style="width: 150px; margin-bottom: 20px;">
          <h1 style="font-size: 24px; color: #333;">Your OTP Code</h1>
          <p style="font-size: 16px; color: #666;">Dear Teacher,</p>
          <p style="font-size: 16px; color: #666;">Your OTP code is <strong>${teacher.otp}</strong>. Please enter this code to complete your login process.</p>
          <p style="font-size: 14px; color: #999;">Thanks,<br>The Patshala Team</p>
        </div>
        <p style="font-size: 12px; color: #999; margin-top: 20px;">This email was sent to you by Patshala. If you have any questions, please contact our support team.</p>
      </div>
    `
    );

    // Set OTP token in cookies
    res.cookie("teacherVerifyToken", otpToken, {
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: "strict",
    });

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    console.error("err.message: ", err);
    res.status(500).send("Server error");
  }
};

// Check if email already exists for teacher
exports.checkEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const emailCheck = await checkEmailExists(email);

    if (emailCheck.exists) {
      if (emailCheck.role === "student") {
        return res.status(409).json({
          message: "User already exists as a student, use a new email!",
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

// Check if teacher ID already exists
exports.checkTeacherId = async (req, res) => {
  const { teacherId } = req.params;
  try {
    const idCheck = await checkIdExists(teacherId);

    if (idCheck.exists) {
      if (idCheck.role === "student") {
        return res.status(409).json({
          message: "ID already exists as a student ID, use teacherID!",
          exists: true,
        });
      } else {
        return res.json({
          message: "ID already exists, use different!",
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

// Handle forgot password for teacher
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ msg: "Teacher does not exist" });
    }

    const { resetToken, hashedToken } = generateResetToken();

    teacher.resetPasswordToken = hashedToken;
    teacher.resetPasswordExpires = Date.now() + 3600000;

    await teacher.save();

    const resetUrl = `http://localhost:5173/teacher/reset-password/${resetToken}`;

    // Send email with reset link
    await sendEmail(
      teacher.email,
      "Reset Your Password",
      `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${resetUrl}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      `
             <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; text-align: center; padding: 20px; background-color: #f5f5f5;">
               <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                 <img src="http://localhost:5173/public/logo.svg" alt="Patshala Logo" style="width: 150px; margin-bottom: 20px;">
                 <h1 style="font-size: 24px; color: #333;">Reset Your Password</h1>
                 <p style="font-size: 16px; color: #666;">Hi there,</p>
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
                <p style="font-size: 16px; color: #666;">We received a request to reset the password for your Patshala account. Click the button below to reset it.</p>
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
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Handle reset password for teacher
exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { resetToken, password } = req.body;

  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const teacher = await Teacher.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!teacher) {
      return res.status(400).json({ msg: "Token is invalid or has expired" });
    }

    teacher.password = await hashPassword(password);

    teacher.resetPasswordToken = undefined;
    teacher.resetPasswordExpires = undefined;

    await teacher.save();

    res.status(200).json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Handle checkResetToken
exports.checkResetToken = async (req, res) => {
  const { token } = req.params;
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const teacher = await Teacher.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!teacher) {
      return res.status(400).json({ msg: "Token is invalid or expired" });
    }

    res.status(200).json({ msg: "Token is valid" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Verify OTP for teacher
exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;

  // Check for the presence of the Authorization header
  if (!req.headers.authorization) {
    return res.status(400).json({ msg: "Authorization header missing" });
  }

  // Ensure the Authorization header has the Bearer token format
  const token = req.headers.authorization.split(" ")[1];
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

    // Find the teacher by email
    let teacher = await Teacher.findOne({ email });

    // Check if teacher exists and OTP matches
    if (!teacher || teacher.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP!" });
    }

    // Check if OTP has expired
    if (Date.now() > teacher.otpExpiration) {
      return res.status(400).json({ msg: "OTP has expired" });
    }

    // Clear the OTP and save the teacher document
    teacher.otp = null;
    teacher.isActive = true;
    await teacher.save();

    // Generate a new token for the user
    const payload = {
      user: {
        id: teacher.id,
        email: teacher.email,
        role: "teacher",
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error("Error signing token:", err.message);
          return res.status(500).send("Server error");
        }
        res.cookie("token", token, {
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("Token verification error:", err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ msg: "Invalid token" });
    } else if (err.name === "TokenExpiredError") {
      return res.status(400).json({ msg: "Token expired" });
    }
    res.status(500).send("Server error");
  }
};

// Resend OTP for teacher
exports.resendOtp = async (req, res) => {
  // Check for the presence of the Authorization header
  if (!req.headers.authorization) {
    return res.status(400).json({ msg: "Authorization header missing" });
  }

  // Ensure the Authorization header has the Bearer token format
  const token = req.headers.authorization.split(" ")[1];
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

    let teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(400).json({ msg: "User not found" });
    }

    const currentTime = new Date();
    const otpExpiresAt = teacher.otpExpiration || new Date(0);

    // Check if the existing OTP has expired
    if (currentTime < otpExpiresAt) {
      return res.status(400).json({
        msg: "An OTP has already been sent. Please wait for it to expire before requesting a new one.",
      });
    }

    // Generate and save new OTP
    teacher.otp = generateOtp().otp;
    teacher.otpExpiration = generateOtp().otpExpiration;
    await teacher.save();

    await sendEmail(
      teacher.email,
      "Your Resent OTP Code",
      `Your OTP code is ${teacher.otp}. Please enter this code to complete your login process. This is a resent code; please use the latest code to proceed.`,
      `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; text-align: center; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <img src="./public/logo.svg" alt="Patshala Logo" style="width: 150px; margin-bottom: 20px;">
          <h1 style="font-size: 24px; color: #333;">Your Resent OTP Code</h1>
          <p style="font-size: 16px; color: #666;">Dear Teacher,</p>
          <p style="font-size: 16px; color: #666;">Your OTP code is <strong>${teacher.otp}</strong>. Please enter this code to complete your login process. This is a resent code; please use the latest code to proceed.</p>
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
      return res.status(400).json({
        msg: "Token Expired! Please relogin!",
      });
    }

    // Generic server error
    return res.status(500).send("Server error");
  }
};
