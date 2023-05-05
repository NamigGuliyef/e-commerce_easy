import { Router } from "express";
import upload from "../config/multer.js";
import {
  createCategoryController,
  createProductController,
  deleteCategoryController,
  deleteProductController,
  updateCategoryController,
  updateProductController,
} from "../controllers/adminController.js";
import { AdminAuthMiddleWare } from "../middlewares/AuthMiddleWare.js";
const r = Router();

//routes

//create-category
r.post("/create-category", AdminAuthMiddleWare, createCategoryController);
//update-category
r.put("/update-category/:id", AdminAuthMiddleWare, updateCategoryController);
//delete category
r.delete("/delete-category/:id", AdminAuthMiddleWare, deleteCategoryController);

//create-product
r.post("/create-product", AdminAuthMiddleWare, upload.single("photo"), createProductController);
//update-product
r.put("/update-product/:id",AdminAuthMiddleWare, upload.single("photo"), updateProductController);
//delete-product
r.delete("/delete-product/:id",AdminAuthMiddleWare,deleteProductController)

export default r;
