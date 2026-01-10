const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Admin", "Student", "Visitor"]
    },
    labels: {
        type: [String],
        default: []
    }
})

module.exports = mongoose.model("User", userSchema) //User here is the name to use 