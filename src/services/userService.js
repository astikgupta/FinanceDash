const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const getAllUsers = async (query) => {
  const { page = 1, limit = 10, role, status } = query;

  const filters = { isDeleted: false };
  if (role) filters.role = role;
  if (status) filters.status = status;

  const skip = (page - 1) * limit;

  const users = await User.find(filters)
    .select("-password")
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filters);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

const updateUserStatus = async (userId, status) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

const softDeleteUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

module.exports = {
  getAllUsers,
  updateUserStatus,
  softDeleteUser,
};
