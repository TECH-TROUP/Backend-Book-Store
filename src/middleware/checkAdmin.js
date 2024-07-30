const checkAdmin = (req, res, next) => {
  if (req.user.role_id !== 1) {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }
  next();
};

module.exports = checkAdmin;
