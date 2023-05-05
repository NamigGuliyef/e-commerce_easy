import categoryModel from "../models/categoryModel.js";

//getAll category
export const categoryController = async (req, res) => {
    try {
      const allCategory = await categoryModel.find();
      return res
        .status(200)
        .send({ success: true, message: "All categories list", allCategory });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Error while getting all caterigoes",
        error: error.message,
      });
    }
  };
  
  //single category
  export const singleCategory = async (req, res) => {
    try {
      const category = await categoryModel.findOne({ slug: req.params.slug });
      return res.status(200).send({
        success: true,
        message: "Get single category successfully",
        category,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Error while getting single categories",
        error: error.message,
      });
    }
  };
  