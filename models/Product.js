const mongoose = require("mongoose");

// Define the Products schema
const productsSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true,
    },

    productDescription: {
        type: String,
        required: true,
        trim: true,
    },

    price: {
        type: Number,
        required: true,
    },

    discountPercentage: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
    },
    stock: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

});

// Export the products model
module.exports = mongoose.model("Product", productsSchema);