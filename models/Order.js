const mongoose = require("mongoose");
// const cart = require('./Cart')

const orderSchema = new mongoose.Schema({
    Address: {
        type: String,
        required: true,

    },
    CartId: [
        {
            type: mongoose.Schema.Types.ObjectId,
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', orderSchema);