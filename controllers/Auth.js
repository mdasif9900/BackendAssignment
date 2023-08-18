const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const User = require("../models/User");

//signup
exports.signUp = async (req, res) => {

    try {
        // fetch data from request body 
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
        } = req.body;

        // validate data 
        if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !contactNumber) {
            return res.status(403).json({
                success: false,
                message: "All fields are requrired",
            })
        }
        // two password match 
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password value does not match please try again!",
            })
        }
        // check user already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered",
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // create entry in DB 
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            contactNumber,
        })

        // return response
        return res.status(200).json({
            success: true,
            message: "User Registered Successfully",
            User: user,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User Cannot be Registered Please try again",
        });

    }
}

//login

exports.login = async (req, res) => {
    try {
        //get data from req body
        const { email, password } = req.body;

        // validation of data 
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        // user exist or not
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not Registered please Sign Up first",
            })
        }

        // match the password 
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            // generate JWT
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h',
            });

            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                // valid for 3 days 
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie('token', token, options).status(200).json(
                {
                    success: true,
                    message: "Logged In Successfully!",
                    token,
                    user,
                }
            )
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failed please try again",
        });
    }
}