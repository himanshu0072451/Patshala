const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  sessionKEY: process.env.SESSION_KEY,
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  resetPasswordUrl: process.env.RESET_PASSWORD_URL,
};
