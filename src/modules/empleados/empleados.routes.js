import { Router } from "express";
import {
  getEmpleados,
  getEmpleado,
  addEmpleado,
  editEmpleado,
  removeEmpleado,
  getEmpleadosByRol,
  getEmpleadosByArea,
} from "./empleados.controller.js";

const router = Router();

// filtros
router.get("/rol/:rol", getEmpleadosByRol);
router.get("/area/:area", getEmpleadosByArea);

// CRUD
router.get("/", getEmpleados);
router.get("/:id", getEmpleado);
router.post("/", addEmpleado);
router.put("/:id", editEmpleado);
router.delete("/:id", removeEmpleado);

export default router;
