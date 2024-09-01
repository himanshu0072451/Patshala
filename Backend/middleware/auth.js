const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  // Read the token from cookies
  const token = req.cookies.token; // Assuming your cookie name is 'token'

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    console.log(decoded, "decoded");
    req.user = decoded.user; // Attach user information to request object
    next(); // Proceed to next middleware or route handler
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}

module.exports = auth;
