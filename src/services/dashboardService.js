const Record = require("../models/Record");
const mongoose = require("mongoose");

const getDashboardStats = async (user, query) => {
  const { startDate, endDate } = query;

  // Showcase Dashboard: Everyone sees all analytics
  const dateFilter = { isDeleted: false };

  if (startDate || endDate) {
    dateFilter.date = {};
    if (startDate) dateFilter.date.$gte = new Date(startDate);
    if (endDate) dateFilter.date.$lte = new Date(endDate);
  } else {
    // Default to current year
    const currentYear = new Date().getFullYear();
    dateFilter.date = {
      $gte: new Date(`${currentYear}-01-01`),
      $lte: new Date(`${currentYear}-12-31`),
    };
  }

  // 1. Total Income & Expense Aggregation
  const stats = await Record.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const income = stats.find((s) => s._id === "income")?.total || 0;
  const expense = stats.find((s) => s._id === "expense")?.total || 0;

  // 2. Category-wise Totals
  const categoryStats = await Record.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  // 3. Monthly Trends
  const monthlyTrends = await Record.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // 4. Recent Transactions
  const recTransQuery = { isDeleted: false };
  if (user.role === "Viewer") {
    recTransQuery.userId = user._id;
  }
  const recentTransactions = await Record.find(recTransQuery)
    .sort({ date: -1 })
    .limit(10);

  return {
    summary: {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
    },
    categoryStats,
    monthlyTrends,
    recentTransactions,
  };
};

module.exports = {
  getDashboardStats,
};
