const checkVendor = (req, res, next) => {
  if (req.user.role_id !== 3) {
    return res.status(403).json({ error: "Access denied: Vendors only" });
  }
  next();
};

module.exports = checkVendor;
