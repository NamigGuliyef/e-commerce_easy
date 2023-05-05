import productModel from "../models/productModel.js";

//get All product

export const productController = async (req, res) => {
  try {
    const product = await productModel.find().populate("category");
    return res.status(200).send({
      success: true,
      message: "All products list",
      countTotal: product.length,
      product,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

//get single product

export const singleProductController = async (req, res) => {
  try {
    const product = await productModel.findOne({ slug: req.params.slug });
    return res.status(200).send({
      success: true,
      message: "Get single product successfully",
      product,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error: error.message,
    });
  }
};
