require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Find the admin user and update role
    const result = await User.findOneAndUpdate(
      { email: "admin@test.com" },
      { role: "admin" },
      { new: true }
    );

    if (result) {
      console.log("✅ Admin role assigned to:", result.email);
    } else {
      console.log("❌ User not found");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
