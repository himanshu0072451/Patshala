const jwt = require("jsonwebtoken");
const config = require("config");

function verifyTeacher(req, res, next) {
  // Extract token from Authorization header or cookies
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, config.get("jwtSecret"));

    // Check if the user has a teacher role
    if (decodedToken.user.role === "teacher") {
      return next(); // Proceed if the user is a teacher
    } else {
      return res
        .status(403)
        .json({ error: "Forbidden. Only teachers can upload notes." });
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(400).json({ error: "Invalid token." });
  }
}

module.exports = verifyTeacher;
