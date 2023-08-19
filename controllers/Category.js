const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }
        const isCategoryExist = await Category.exists({ name });
        if (isCategoryExist) {
            return res.status(400).json({
                success: false,
                message: "Category already exist, please try again",
            })
        }

        const CategoryDetails = await Category.create({
            name: name,
            description: description,
        });

        return res.status(200).json({
            success: true,
            message: "Categorys Created Successfully",
            CategoryDetails: CategoryDetails,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Category creation failed",
            error: error.message,
        });
    }
}

exports.showAllCategories = async (req, res) => {
    try {
        const categoryList = await Category.find({});
        if (categoryList.length > 0) {
            return res.status(200).json({
                success: true,
                Data: categoryList,
            });
        }
        return res.status(404).json({
            success: false,
            message: "No Category found",
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to get categories please try again",
            error: error.message,
        });
    }

}