import joi from "joi";
import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import productModel from "../models/productModel.js";

//create-category
export const createCategoryController = async (req, res) => {
  try {
    const categorySchema = joi.object({
      name: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z əöğıüçşƏÖĞIÜÇŞ]{3,30}$"))
        .required(),
    });
    const {
      error,
      value: { name },
    } = categorySchema.validate(req.body);
    if (error) {
      return res.status(401).send({ success: false, message: error.message });
    }
    const category = await categoryModel.create({ name, slug: slugify(name) });
    return res
      .status(201)
      .send({ success: true, message: "new category created", category });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in category",
      error: error.message,
    });
  }
};

//update-category
export const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { $set: { name, slug: slugify(name) } },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while updating category",
      error: error.message,
    });
  }
};

//delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    return res
      .status(200)
      .send({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error: error.message,
    });
  }
};

//create product

export const createProductController = async (req, res) => {
  try {
    const productSchema = joi.object({
      name: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z əöğıüçşƏÖĞIÜÇŞ]{3,30}$"))
        .required(),
      description: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9,./ -əöğıüçşƏÖĞIÜÇŞ]{3,100}$"))
        .required(),
      price: joi.number().required(),
      category: joi.string().required(),
      quantity: joi.number().integer().required(),
      photo: joi.string(),
      shipping: joi.boolean(),
    });
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(401).send({ success: false, message: error.message });
    }
    const data = await cloudinary.uploader.upload(req.file.path, {
      public_id: req.file.originalname,
    });
    const product = await productModel.create({ ...value, slug: slugify(value.name), photo: data.url });
    return res.status(200).send({ success: true, message: "Product created successfully", product })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in creating product",
      error: error.message,
    });
  }
};

//update product

export const updateProductController = async (req, res) => {
  try {
const productSchema = joi.object({
  name: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z əöğıüçşƏÖĞIÜÇŞ]{3,30}$"))
    .required(),
  description: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9,./ -əöğıüçşƏÖĞIÜÇŞ]{3,100}$"))
    .required(),
  price: joi.number().required(),
  category: joi.string().required(),
  quantity: joi.number().integer().required(),
  photo: joi.string(),
  shipping: joi.boolean(),
});
const {error,value}=productSchema.validate(req.body)
if(error){
  return res.status(401).send({ success: false, message: error.message });
}
const data = await cloudinary.uploader.upload(req.file.path, {
  public_id: req.file.originalname,
});
  const product=await productModel.findByIdAndUpdate(req.params.id,{$set:{...value,slug:slugify(value.name),photo:data.url}})
  return res.status(200).send({success:true,message:"Update product successfully",product})
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while update product",
      error: error.message,
    });
  }
};

//delete product

export const deleteProductController = async(req, res) => {
  try{
    await productModel.findByIdAndDelete(req.params.id)
    return res.status(200).send({ success: true, message: "Product deleted successfully" });
  }catch(error){
    return res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error: error.message,
    });
  }
}


