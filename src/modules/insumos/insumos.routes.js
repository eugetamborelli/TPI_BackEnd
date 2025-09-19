import { Router } from "express";
import insumosController from "./insumos.controller.js";

const router = Router();

// Filtros y consultas específicas (antes de :id)
router.get("/categoria/:categoria", insumosController.getByCategoria);
router.get("/proveedor/:proveedor", insumosController.getByProveedor);
router.get("/bajo-stock", insumosController.getBajoStock);

// Movimientos
router.patch("/:id/ingreso", insumosController.ingresoStock);
router.patch("/:id/egreso", insumosController.egresoStock);

// CRUD
router.get("/", insumosController.getInsumos);
router.get("/:id", insumosController.getInsumo);
router.post("/", insumosController.addInsumo);
router.put("/:id", insumosController.editInsumo);
router.delete("/:id", insumosController.removeInsumo);

export default router;
