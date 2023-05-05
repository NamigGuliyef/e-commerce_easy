import { Router } from "express";
import { categoryController, singleCategory } from "../controllers/categoryController.js";
const r = Router()

//getAll category
r.get("/get-category", categoryController);
//single category
r.get("/single-category/:slug", singleCategory);

export default r