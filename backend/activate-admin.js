const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./src/models/User");

dotenv.config();

const activateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
        
        const result = await User.updateOne(
            { email: "admin@example.com" },
            { $set: { status: "Active" } }
        );
        
        if (result.modifiedCount > 0) {
            console.log("Admin account ACTIVATED successfully!");
        } else {
            console.log("Admin account is already active or not found.");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

activateAdmin();
