const userService = require("../services/userService");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const getUsers = catchAsync(async (req, res) => {
  const usersData = await userService.getAllUsers(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, usersData, "Users fetched successfully"));
});

const updateUserStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const user = await userService.updateUserStatus(req.params.id, status);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User status updated successfully"));
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.softDeleteUser(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

module.exports = {
  getUsers,
  updateUserStatus,
  deleteUser,
};
