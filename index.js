const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const database = require("./config/database");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;

//database connect

database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());


//routes
app.use("/api/v1/auth", userRoutes);

console.log("Starting")

//default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: 'Your server is up and running....'
    });
});

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`)
})

