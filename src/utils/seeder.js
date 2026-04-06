const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Record = require("../models/Record");

dotenv.config();

const categories = ["Food", "Salary", "Rent", "Entertainment", "Health", "Transport", "Shopping"];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Record.deleteMany({});
    console.log("Cleared existing data.");

    // 1. Create Users
    const admin = await User.create({
      name: "Test Admin",
      email: "admin@example.com",
      password: "password123",
      role: "Admin",
    });

    const analyst = await User.create({
      name: "Test Analyst",
      email: "analyst@example.com",
      password: "password123",
      role: "Analyst",
    });

    const viewer = await User.create({
      name: "Test Viewer",
      email: "viewer@example.com",
      password: "password123",
      role: "Viewer",
    });

    console.log("Users created.");

    // 2. Create Records for Admin & Analyst
    const users = [admin, analyst];
    const records = [];

    for (const user of users) {
      for (let i = 0; i < 30; i++) {
        const type = Math.random() > 0.4 ? "expense" : "income";
        const amount = type === "income" ? Math.floor(Math.random() * 5000) + 2000 : Math.floor(Math.random() * 1000) + 50;
        const category = type === "income" ? "Salary" : categories[Math.floor(Math.random() * categories.length)];
        
        // Random date in the last 6 months
        const date = new Date();
        date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
        date.setDate(Math.floor(Math.random() * 28) + 1);

        records.push({
          amount,
          type,
          category,
          date,
          notes: `Sample ${type} for ${category}`,
          userId: user._id,
        });
      }
    }

    await Record.insertMany(records);
    console.log(`Successfully seeded ${records.length} records.`);

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
