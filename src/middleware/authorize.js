const ApiError = require("../utils/ApiError");

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `User role '${req.user.role}' is not authorized to access this resource`);
    }

    next();
  };
};

module.exports = authorize;
