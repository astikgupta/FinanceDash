const app = require("./app");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed !!! ", err);
  });
