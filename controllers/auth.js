const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//signup handler
exports.signup = async (req , res) =>{
    try{
        // get data
        const{name,email,password,role} = req.body
        
        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: name, email, password"
            });
        }
        
        //check if user is already there?
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success : false,
                message : "This account already exists"
            })
        }
        //securing the password 
        let hashedpass;
        try{
            hashedpass = await bcrypt.hash(password,10);
        }
        catch(err){
            return res.status(500).json({
                success : false,
                message : 'Cannot hash the password'
            })
        }
        //create a new entry for signup for the user
        const user = await User.create({
            name,email,password:hashedpass,role
        })
        
        return res.status(201).json({
            success : true,
            message : "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }

    catch(error){
        console.log(error)
        return res.status(500).json({
            success : false,
            message : "User cannot be registered"
        })
    }
}

//login handler
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        
        // Generate JWT token
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h"
        });
        
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
}