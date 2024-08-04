const checkAdminOrVendor = (req, res, next) => {
  if (req.user.role_id !== 1 && req.user.role_id !== 3) {
    return res
      .status(403)
      .json({ error: "Access denied: Admins or Vendors only" });
  }
  next();
};

module.exports = checkAdminOrVendor;
