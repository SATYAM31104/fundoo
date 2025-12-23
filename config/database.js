const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("DB Connection Failed:", error.message);
        console.log("Please check:");
        console.log("1. Your MongoDB Atlas IP whitelist settings");
        console.log("2. Your database credentials");
        console.log("3. Your network connection");
        process.exit(1);
    }
};