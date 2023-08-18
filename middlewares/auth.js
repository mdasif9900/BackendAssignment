const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

//auth
exports.auth = async (req, res, next) => {
    try {
        // extract token 
        const token = req.cookies.token || req.header('Authorization').replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }
        // verify the token 
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            })
        }
        next();

    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
        });

    }
}


// isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admins Only",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User Role connot be varified, please try again',
        })
    }
}

//isUser
exports.isUser = async (req, res, next) => {
    try {
        if (req.user.accountType !== "User") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Users Only",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User Role connot be varified, please try again',
        })
    }
}