const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addProductToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            productId,
            quantity
        } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // check if product is valid or not 
        const isValidProduct = await Product.findOne({ _id: productId });
        if (!isValidProduct) {
            return res.status(400).json({
                success: false,
                message: "Product Id is invalid, please check it."
            });
        }

        // check if product is already added in cart 
        const productExist = await Cart.findOne({ product: productId });
        if (productExist) {
            return res.status(400).json({
                success: false,
                message: "Product already exists. If you want to increase count please update quantity",
            });
        }

        const addProductToCart = await Cart.create({
            product: productId,
            quantity,
            user: userId
        });

        return res.status(200).json({
            success: true,
            message: `Product with id ${productId} added to cart Successfully`,
            data: addProductToCart,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to add products in cart",
            error: error.message,
        });
    }
}

exports.showMyCart = async (req, res) => {
    try {

        const userId = req.user.id;
        const mycartDetails = await Cart.find({ user: userId }).populate('product');
        const count = await Cart.find({ user: userId }).count();

        if (mycartDetails.length == 0) {
            return res.status(200).json({
                success: true,
                message: "YOUR CART IS EMPTY",
            });
        }
        return res.status(200).json({
            success: true,
            message: `Your Cart Details fetched successfully `,
            ItemsCount: count,
            data: mycartDetails,
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart details",
            error: error.message,
        });
    }
}


exports.updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Please Provide a Product ID and Quantity",
            });
        }

        const productExist = await Cart.findOne({ product: productId, user: userId });
        if (!productExist) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        const mycartProductquantityUpdate = await Cart.findOneAndUpdate({ product: productId, user: userId }, { quantity: quantity }, { new: true })

        if (mycartProductquantityUpdate) {
            return res.status(200).json({
                success: true,
                message: `Quantity updated for product Id ${productId}`,
                data: mycartProductquantityUpdate,
            });
        };

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `Failed to update quantity.`,
            error: error.message,
        });
    }
}

exports.removeProductFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Please Provide a Product ID",
            });
        }

        // check if product is added into the cart or not 
        const productExist = await Cart.findOne({ product: productId, user: userId });
        if (!productExist) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        // Remove the product from cart
        const removeProductFromCart = await Cart.findOneAndDelete({ product: productId, user: userId }).populate('product');

        return res.status(200).json({
            success: true,
            message: "Product Removed successfully",
            Removed_Item: removeProductFromCart,
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Remove Product",
            error: error.message,
        });
    }
}