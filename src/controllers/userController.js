const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({ isDeleted: false }).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (role) user.role = role;
  if (status) user.status = status;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isDeleted = true;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};
