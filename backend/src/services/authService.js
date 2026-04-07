const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const register = async (userData) => {
  const { email } = userData;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const user = await User.create(userData);
  const userWithoutPassword = await User.findById(user._id).select("-password");

  return userWithoutPassword;
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || user.isDeleted || user.status === "Inactive") {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = user.generateAccessToken();
  const loggedInUser = await User.findById(user._id).select("-password");

  return { user: loggedInUser, accessToken };
};

module.exports = {
  register,
  login,
};
