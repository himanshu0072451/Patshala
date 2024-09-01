const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

// Hash password
exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

// Compare passwords
exports.comparePassword = async (enteredPassword, storedPassword) => {
  try {
    return await bcrypt.compare(enteredPassword, storedPassword);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

// Generate JWT token
exports.generateToken = (payload, expiresIn = "30d") => {
  try {
    return jwt.sign(payload, config.get("jwtSecret"), { expiresIn });
  } catch (error) {
    throw new Error("Error generating token");
  }
};

// Generate OTP and expiration time
exports.generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiration = new Date(Date.now() + 60 * 1000);
  return { otp, otpExpiration };
};

// Send email
exports.sendEmail = async (to, subject, text, html, amp = "") => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      secure: false,
      auth: {
        user: config.get("emailUser"),
        pass: config.get("emailPassword"),
      },
    });

    const mailOptions = {
      to,
      from: config.get("emailUser"),
      subject,
      text,
      html,
      amp,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new Error("Error sending email");
  }
};

// Check if email already exists
exports.checkEmailExists = async (email) => {
  try {
    const teacher = await Teacher.findOne({ email });
    const student = await Student.findOne({ email });
    if (teacher) return { exists: true, role: "teacher" };
    if (student) return { exists: true, role: "student" };
    return { exists: false };
  } catch (error) {
    throw new Error("Error checking email existence");
  }
};

// Check if teacherId or studentId already exists
exports.checkIdExists = async (id) => {
  try {
    const teacher = await Teacher.findOne({ "teacherDetails.teacherId": id });
    const student = await Student.findOne({
      "studentDetails.studentId": id,
    });
    if (teacher) return { exists: true, role: "teacher" };
    if (student) return { exists: true, role: "student" };
    return { exists: false };
  } catch (error) {
    throw new Error("Error checking ID existence");
  }
};

exports.isEnrollNumExists = (enrollmentNum, studentsData, studentName) => {
  // Ensure studentName is a string, even if undefined
  const sanitizedStudentName = studentName
    ? studentName.toLowerCase().trim()
    : "";

  // Split the input name into components
  const inputNameComponents = sanitizedStudentName.split(/\s+/); // Split by whitespace

  // Find the student with the given enrollment number
  const student = studentsData.find(
    (student) => student.enrollment === enrollmentNum
  );

  if (student) {
    // Ensure student.name is a string before calling toLowerCase and trim extra spaces
    const storedName = student.name ? student.name.toLowerCase().trim() : "";

    // Split the stored name into components
    const storedNameComponents = storedName.split(/\s+/); // Split by whitespace

    // Check if all components of the input name are present in the stored name
    const allComponentsMatch = inputNameComponents.every((component) =>
      storedNameComponents.includes(component)
    );

    if (allComponentsMatch) {
      return { exists: true, message: "Enrollment number and name match." };
    } else {
      return {
        exists: true, // Enrollment number exists
        message: "The enrollment number exists, but the name does not match.",
      };
    }
  }

  // Enrollment number does not exist
  return { exists: false, message: "Enrollment number does not exist." };
};
// Generate password reset token
exports.generateResetToken = () => {
  try {
    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    return { resetToken, hashedToken };
  } catch (error) {
    throw new Error("Error generating reset token");
  }
};
