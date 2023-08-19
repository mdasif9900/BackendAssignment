const Cart = require('../models/Cart');
const Order = require('../models/Order')


exports.placeOrder = async (req, res) => {
    try {
        var validCartIds = true;
        const userId = req.user.id;
        const {
            orderProducts,
            Address,
        } = req.body;

        if (orderProducts.length == 0 || !Address) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        // check if cart id is valid or not
        const newArray = orderProducts.map((orderItem) => { return orderItem.cartId })
        for (var i = 0; i < newArray.length; i++) {
            const isValidCartId = await Cart.findById(newArray[i]);
            if (!isValidCartId) {
                validCartIds = false;
                break;
            }
        }

        // if not valid 
        if (!validCartIds) {
            return res.status(400).json({
                success: false,
                message: "Cart Id not found, Please check the card Id",
            });
        }

        const placeOrder = await Order.create({ user: userId, Address, });

        orderProducts.map(async (orderItem) => {
            await Order.findByIdAndUpdate(
                {
                    _id: placeOrder._id,
                },
                {
                    $push: {
                        CartId: orderItem.cartId,
                    }
                }
            );
            await Cart.findByIdAndRemove(orderItem.cartId);

        });


        return res.status(200).json({
            success: true,
            message: "Order Placed Successfully",
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message,
        });
    }
}

exports.viewOrderDetail = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user.id;

        if (!orderId) {
            return res
                .status(400)
                .json({ success: false, message: "Please Provide Required Field" });
        }

        const viewOrder = await Order.findOne({ _id: orderId }).
            populate({
                path: "CartId",
                populate: {
                    path: "product",
                    populate: {
                        path: "category"
                    },
                },
            }).exec();

        if (!viewOrder) {
            return res.status(404)
                .json({
                    success: false,
                    message: `Order not found with order id ${orderId}`,
                });
        }
        return res.status(200).json({
            success: true,
            message: "Fetched order details successfully",
            data: viewOrder,
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Retrive order details",
            error: error.message,
        });
    }
}

exports.viewAllMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const viewAllMyOrders = await Order.find({ user: userId }).
            populate({
                path: "CartId",
                populate: {
                    path: "product",
                },
            }).exec();
        const count = await Order.find({ user: userId }).count();
        if (viewAllMyOrders.length == 0) {
            return res.status(404)
                .json({
                    success: false,
                    message: `Orders not found, Please place your orders`,
                });
        }
        return res.status(200).json({
            success: true,
            message: "Fetched orders successfully",
            ItemsCount: count,
            data: viewAllMyOrders,
           
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Retrive Orders",
            error: error.message,
        });
    }
}