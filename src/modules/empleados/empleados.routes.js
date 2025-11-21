import { Router } from "express";
import empleadosController from "./empleados.controller.js";
import { validarCampos } from "./empleados.middleware.js";
import { authenticate, requireEmpleado } from "../auth/auth.middleware.js";

const router = Router();

// Todas las rutas de empleados requieren autenticación y que el usuario sea empleado
router.use(authenticate, requireEmpleado);

router.get("/rol/:rol", empleadosController.getEmpleadosByRol);
router.get("/area/:area", empleadosController.getEmpleadosByArea);
router.get("/dni/:dni", empleadosController.getEmpleadoByDni);
router.get("/", empleadosController.getEmpleados);
router.get("/:id", empleadosController.getEmpleado);
router.post("/", empleadosController.addEmpleado);
router.patch("/:id", validarCampos, empleadosController.editEmpleado);
router.delete("/:id", empleadosController.removeEmpleado);

export default router;
