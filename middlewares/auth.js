const jwt = require("jsonwebtoken");
require('dotenv').config();

//middleware to check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        //verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token is invalid"
        });
    }
};
