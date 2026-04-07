const dashboardService = require("../services/dashboardService");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");

const getStats = catchAsync(async (req, res) => {
  const stats = await dashboardService.getDashboardStats(req.user, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});

module.exports = {
  getStats,
};
