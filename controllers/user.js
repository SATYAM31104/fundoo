const User = require("../models/user");
const bcrypt = require("bcrypt");
// READ: Get a single user by ID
exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // Return user data (excluding password ideally, but for basic CRUD we include it or set it to undefined)
        user.password = undefined;
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error retrieving user",
            error: error.message,
        });
    }
};
// READ: Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        
        // Remove passwords from response
        const usersSafe = users.map(user => {
            user.password = undefined;
            return user;
        });
        res.status(200).json({
            success: true,
            count: users.length,
            users: usersSafe,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error retrieving users",
            error: error.message,
        });
    }
};
// UPDATE: Update user details
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, role, email } = req.body;
        // Find and update
        // { new: true } returns the updated document
        // { runValidators: true } ensures schema validation
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, role, email },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        updatedUser.password = undefined;
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating user",
            error: error.message,
        });
    }
};
// DELETE: Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message,
        });
    }
};