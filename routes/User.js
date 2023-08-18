// Import the required modules
const express = require("express")
const router = express.Router()


// Import the required controllers and middleware functions
const {
    login,
    signUp,
} = require("../controllers/Auth")



// Routes for Login, Signup

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signUp)


// Export the router for use in the main application
module.exports = router