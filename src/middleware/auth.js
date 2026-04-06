const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");

const verifyJWT = catchAsync(async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "No token provided, access denied");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken._id).select("-password");

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    if (user.isDeleted || user.status === "Inactive") {
      throw new ApiError(401, "User account is suspended or deleted");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

module.exports = verifyJWT;
