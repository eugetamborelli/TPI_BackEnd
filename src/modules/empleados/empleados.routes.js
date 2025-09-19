import { Router } from "express";
import empleadosController from "./empleados.controller.js"; // export default new EmpleadosController()

const router = Router();

router.get("/rol/:rol", empleadosController.getEmpleadosByRol);
router.get("/area/:area", empleadosController.getEmpleadosByArea);
router.get("/", empleadosController.getEmpleados);
router.get("/:id", empleadosController.getEmpleado);
router.post("/", empleadosController.addEmpleado);
router.put("/:id", empleadosController.editEmpleado);
router.delete("/:id", empleadosController.removeEmpleado);

export default router;
