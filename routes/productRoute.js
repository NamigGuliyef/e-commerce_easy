import { Router } from "express";
import {
  productController,
  singleProductController,
} from "../controllers/productController.js";
const r = Router();

//get All products
r.get("/get-product", productController);
//single product
r.get("/single-product/:slug", singleProductController);

export default r;
