const recordService = require("../services/recordService");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");
const { recordSchema } = require("../utils/validationSchemas");
const ApiError = require("../utils/ApiError");

const createRecord = catchAsync(async (req, res) => {
  const { error } = recordSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const record = await recordService.createRecord(req.user, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, record, "Record created successfully"));
});

const getRecords = catchAsync(async (req, res) => {
  const recordsData = await recordService.getRecords(req.user, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, recordsData, "Records fetched successfully"));
});

const updateRecord = catchAsync(async (req, res) => {
  const { error } = recordSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const record = await recordService.updateRecord(req.params.id, req.user, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, record, "Record updated successfully"));
});

const deleteRecord = catchAsync(async (req, res) => {
  await recordService.deleteRecord(req.params.id, req.user);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Record deleted successfully"));
});

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
};
