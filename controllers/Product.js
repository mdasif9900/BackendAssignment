const Product = require('../models/Product')
const Category = require('../models/Category');


exports.createProduct = async (req, res) => {
    try {

        const {
            productName,
            productDescription,
            price,
            discountPercentage,
            thumbnail,
            rating,
            stock,
            brand,
            category,
        } = req.body;

        if (!productName ||
            !productDescription ||
            !price ||
            !discountPercentage ||
            !thumbnail ||
            !stock ||
            !brand ||
            !category) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
            });
        }

        // check the metioned category is present or not 
        const isCategoryExist = await Category.exists({ _id: category });
        if (!isCategoryExist) {
            return res.status(404).json({
                success: false,
                message: "Category does not exist",
            });
        }
        const newProduct = await Product.create({
            productName,
            productDescription,
            price,
            discountPercentage,
            thumbnail,
            rating,
            stock,
            brand,
            category,
        })

        // make an entry of associated products in the category schema. 
        await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    Products: newProduct._id,
                }
            }

        );
        // return response 
        res.status(200).json({
            success: true,
            message: "Product Created Successfully",
            data: newProduct,
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Product Creation failed, please try again.",
            error: error.message,
        });
    }
}

exports.editProduct = async (req, res) => {
    try {

        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Please Provide a Product ID",
            });
        }

        const updates = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found!." });
        }

        // Update only the fields that are present in the request body
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                product[key] = updates[key];
            }
        }
        await product.save();
        const updatedProduct = await Product.findOne({
            _id: productId,
        });
        res.json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Product Edit failed, please try again.",
            error: error.message,
        });
    }

}

exports.showAllProducts = async (req, res) => {
    try {
        const productsList = await Product.find({});
        const count = await Product.find({}).count();
        if (productsList.length > 0) {
            return res.status(200).json({
                success: true,
                ItemsCount:count,
                Data: productsList,
            });
        }
        return res.status(404).json({
            success: false,
            message: "No Product found",
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Get All Products",
            error: error.message,
        });
    }
}

exports.getProductDetails = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Please Provide a Product ID",
            });
        }
        const productDetails = await Product.findOne({
            _id: productId,
        })
        if (!productDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find Product with id: ${productId}`,
            })
        }
        return res.status(200).json({
            success: true,
            data: productDetails,
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Get Product Details",
            error: error.message,
        });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Please Provide a Product ID",
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // remove product from category schema 
        await Category.findByIdAndUpdate({ _id: product.category },
            {
                $pull: { Products: productId },
            },
        );

        // Delete the product
        await Product.findByIdAndDelete(productId);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Delete Product",
            error: error.message,
        });
    }
}