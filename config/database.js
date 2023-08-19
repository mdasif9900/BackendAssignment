
const mongoose = require('mongoose');
require("dotenv").config();

exports.connect = () => {
    mongoose.connect("mongodb+srv://mdasif9957:W8XobOOuRwEKpYb5@cluster0.o6wamx1.mongodb.net/BackendAssignmentDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log("DB connected successfully"))
        .catch((error) => {
            console.log("DB connection failed", error);
            process.exit(1);
        });
};