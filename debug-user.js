const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./src/models/User");

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
        
        const admin = await User.findOne({ email: "admin@example.com" });
        if (!admin) {
            console.log("Admin user not found!");
        } else {
            console.log("Admin found:", {
                email: admin.email,
                role: admin.role,
                status: admin.status,
                isDeleted: admin.isDeleted
            });
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAdmin();
