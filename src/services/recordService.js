const Record = require("../models/Record");
const ApiError = require("../utils/ApiError");

const createRecord = async (user, recordData) => {
  return await Record.create({ ...recordData, userId: user._id });
};

const getRecords = async (user, query) => {
  const {
    page = 1,
    limit = 10,
    type,
    category,
    startDate,
    endDate,
    search,
  } = query;

  // RBAC: Admins see all,  // RBAC: Admins see all analytics, others only see their own
  const dateFilter = { isDeleted: false };
  if (user.role !== "Admin") {
    dateFilter.userId = new mongoose.Types.ObjectId(user._id);
  }
  const filters = { isDeleted: false };
  if (user.role !== "Admin") {
    filters.userId = user._id;
  }

  if (type) filters.type = type;
  if (category) filters.category = category;
  if (startDate || endDate) {
    filters.date = {};
    if (startDate) filters.date.$gte = new Date(startDate);
    if (endDate) filters.date.$lte = new Date(endDate);
  }

  if (search) {
    filters.$or = [
      { category: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } },
    ];
  }

  // 4. Recent Transactions
  const recTransQuery = { isDeleted: false };
  if (user.role !== "Admin") {
    recTransQuery.userId = user._id;
  }
  const recentTransactions = await Record.find(recTransQuery)
    .sort({ date: -1 })
    .limit(10);

  const skip = (page - 1) * limit;

  const records = await Record.find(filters)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Record.countDocuments(filters);

  return {
    records,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

const updateRecord = async (recordId, user, updateData) => {
  const query = { _id: recordId, isDeleted: false };
  if (user.role !== "Admin") {
    query.userId = user._id; // Non-admins can only update their own
  }

  const record = await Record.findOneAndUpdate(
    query,
    updateData,
    { new: true, runValidators: true }
  );

  if (!record) {
    throw new ApiError(404, "Record not found");
  }

  return record;
};

const deleteRecord = async (recordId, user) => {
  const query = { _id: recordId, isDeleted: false };
  if (user.role !== "Admin") {
    query.userId = user._id; // Non-admins can only delete their own
  }

  const record = await Record.findOneAndUpdate(
    query,
    { isDeleted: true },
    { new: true }
  );

  if (!record) {
    throw new ApiError(404, "Record not found");
  }

  return record;
};

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
};
