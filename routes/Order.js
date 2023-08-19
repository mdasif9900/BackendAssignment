const express = require("express")
const router = express.Router();

const { auth, isUser } = require("../middlewares/auth");
const { placeOrder, viewOrderDetail, viewAllMyOrders } = require("../controllers/Orders");

router.post('/placeOrder', auth, isUser, placeOrder);
router.post('/viewOrderDetail', auth, isUser, viewOrderDetail);
router.get('/viewAllMyOrders', auth, isUser, viewAllMyOrders);


module.exports = router