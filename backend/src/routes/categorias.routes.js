import { Router } from "express";
import { methodHTTP as categoriaController } from "../controllers/categoria.controllers.js";
const router = Router();

router.get("/", categoriaController.getCategorias) 
router.get("/:id", categoriaController.getCategory) 
router.post("/", categoriaController.postCategorias)

export default router;