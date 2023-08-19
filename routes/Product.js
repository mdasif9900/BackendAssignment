const express = require("express")
const router = express.Router()

// Importing Middlewares
const { auth, isAdmin } = require("../middlewares/auth")


const { createCategory, showAllCategories } = require('../controllers/Category');

const {
    createProduct,
    editProduct,
    showAllProducts,
    getProductDetails,
    deleteProduct
} = require('../controllers/Product');

// Category,Product can Only be Created by Admin.

// category routes.
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);

// Prouct routes
router.post("/createProduct", auth, isAdmin, createProduct);
router.post("/editProduct", auth, isAdmin, editProduct);
router.get("/showAllProducts", showAllProducts);
router.post("/getProductDetails/", getProductDetails);
router.delete("/deleteProduct", auth, isAdmin, deleteProduct);


module.exports = router