// This runs AFTER authMiddleware
// authMiddleware confirms they're logged in
// adminMiddleware confirms they're an admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // They're admin, let them through
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

module.exports = { adminOnly };