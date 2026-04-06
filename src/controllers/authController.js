const authService = require("../services/authService");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");
const { registerSchema, loginSchema } = require("../utils/validationSchemas");
const ApiError = require("../utils/ApiError");

const registerUser = catchAsync(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const user = await authService.register(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

const loginUser = catchAsync(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { email, password } = req.body;
  const data = await authService.login(email, password);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "User logged in successfully"));
});

module.exports = {
  registerUser,
  loginUser,
};
