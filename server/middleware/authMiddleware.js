const jwt = require("jsonwebtoken");
const User = require("../models/User");

// This runs before any protected route
// It checks: "is this user logged in?"
const protect = async (req, res, next) => {
  let token;

  // JWT is sent in the header like: "Bearer eyJhbGci..."
  if (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")) {

    try {
      // Extract token by removing "Bearer " prefix
      token = req.headers.authorization.split(" ")[1];

      // Verify token using our secret key
      // If token is fake or expired, this throws an error
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (without password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Move to the actual route handler
    } catch (error) {
      return res.status(401).json({ message: "Token invalid" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = { protect };