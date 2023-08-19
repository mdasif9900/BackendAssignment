const express = require("express")
const router = express.Router();

// Importing Middlewares
const { auth, isUser } = require("../middlewares/auth");

const {
    addProductToCart,
    showMyCart,
    updateQuantity,
    removeProductFromCart
} = require('../controllers/Cart');

router.post('/addProductToCart', auth, isUser, addProductToCart);
router.get('/showMyCart', auth, isUser, showMyCart);
router.post('/updateQuantity', auth, isUser, updateQuantity);
router.post('/removeProductFromCart', auth, isUser, removeProductFromCart);

module.exports = router