// Role-based authorization
const authRoles = (...roles) => {
  return (req, res, next) => {
    // if (!roles.includes(req.user.role)) {
    //   return res.status(403).json({ message: "access denied role" });
    // }
    next();
  };
};

module.exports = authRoles;
