// src/modules/empleados/empleados.controller.js
import {
  buscarEmpleados,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
  getEmpleadoById,
} from "./empleados.model.js";

// Listas predeterminadas (las mantenemos acá para las vistas)
const ROLES = [
  "médico",
  "enfermera",
  "recepcionista",
  "administrador",
  "encargado de stock",
  "laboratorista",
  "kinesiólogo",
];

const AREAS = [
  "Atención Médica",
  "Pediatría",
  "Emergencias",
  "Administración de Turnos",
  "Facturación",
  "Stock de Insumos",
  "Laboratorio",
  "Enfermería",
];

class EmpleadosController {
  constructor() {
    this.ROLES = ROLES;
    this.AREAS = AREAS;
  }

  // --- Views ---

  renderDashboard = (req, res) => {
    res.render("empleados/dashboard", { titulo: "Gestión de Empleados" });
  };

  renderNuevoEmpleado = (req, res) => {
    res.render("empleados/nuevoEmpleado", {
      titulo: "Alta de empleado",
      formData: {},
      ROLES: this.ROLES,
      AREAS: this.AREAS,
    });
  };

  // --- Listado + filtros (DNI / Rol) ---

  getEmpleadosListado = async (req, res) => {
    const rawDni = req.query.dni ?? "";
    const rawRol = req.query.rol ?? "";

    const dni = String(rawDni).trim();
    const rol = String(rawRol).trim();

    try {
      const empleados = await buscarEmpleados({ dni, rol });

      // Adaptamos para que las vistas sigan usando emp.id
      const empleadosView = empleados.map((e) => ({
        ...e,
        id: e._id ? String(e._id) : "",
      }));

      res.render("empleados/listado", {
        empleados: empleadosView,
        dniBusqueda: dni,
        rolBusqueda: rawRol,
        ROLES: this.ROLES,
        AREAS: this.AREAS,
      });
    } catch (error) {
      res.render("empleados/listado", {
        empleados: [],
        error: error.message,
        dniBusqueda: dni,
        rolBusqueda: rawRol,
        ROLES: this.ROLES,
        AREAS: this.AREAS,
      });
    }
  };

  // --- CRUD ---

  addEmpleado = async (req, res) => {
    try {
      const { rol, area } = req.body;

      if (!this.ROLES.includes(rol)) {
        throw new Error("Rol inválido");
      }
      if (!this.AREAS.includes(area)) {
        throw new Error("Área inválida");
      }

      await createEmpleado(req.body);

      res.redirect("/empleados/listado");
    } catch (error) {
      res.status(400).render("empleados/nuevoEmpleado", {
        error: error.message,
        formData: req.body || {},
        ROLES: this.ROLES,
        AREAS: this.AREAS,
      });
    }
  };

  renderEditarEmpleado = async (req, res) => {
    try {
      const { id } = req.params;
      const empleado = await getEmpleadoById(id);

      if (!empleado) return res.redirect("/empleados/listado");

      const empleadoView = {
        ...empleado,
        id: empleado._id ? String(empleado._id) : "",
      };

      res.render("empleados/editarEmpleado", {
        empleado: empleadoView,
        ROLES: this.ROLES,
        AREAS: this.AREAS,
      });
    } catch {
      res.redirect("/empleados/listado");
    }
  };

  updateEmpleado = async (req, res) => {
    const { id } = req.params;
    const target = await getEmpleadoById(id);

    if (!target) {
      return res.status(400).render("empleados/editarEmpleado", {
        error: "Empleado no encontrado",
        empleado: { id, ...req.body },
        ROLES: this.ROLES,
        AREAS: this.AREAS,
      });
    }

    try {
 const payload = { ...req.body };

// No permitimos actualizar el legajo desde el formulario
if ("legajo" in payload) {
  delete payload.legajo;
}

      if (Object.prototype.hasOwnProperty.call(payload, "activo")) {
        payload.activo = !!payload.activo;
      }

      if (payload.rol && !this.ROLES.includes(payload.rol)) {
        throw new Error("Rol inválido");
      }
      if (payload.area && !this.AREAS.includes(payload.area)) {
        throw new Error("Área inválida");
      }

      const empActualizado = await updateEmpleado(id, payload);

      if (!empActualizado) {
        throw new Error("Error al actualizar (DNI en uso o datos inválidos)");
      }

      res.redirect("/empleados/listado");
    } catch (error) {
      res.status(400).render("empleados/editarEmpleado", {
        error: error.message,
        empleado: { id: target._id ? String(target._id) : id, ...req.body },
        ROLES: this.ROLES,
        AREAS: this.AREAS,
      });
    }
  };

  deleteEmpleado = async (req, res) => {
    try {
      const { id } = req.params;
      const target = await getEmpleadoById(id);

      if (!target) {
        throw new Error("Empleado no encontrado para la eliminación");
      }

      const ok = await deleteEmpleado(id);

      if (!ok) {
        throw new Error("No se pudo eliminar el empleado");
      }

      const empleados = await buscarEmpleados({});

      const empleadosView = empleados.map((e) => ({
        ...e,
        id: e._id ? String(e._id) : "",
      }));

      res.redirect("/empleados/listado");
    } catch (error) {
      // Si falla, intentamos mostrar listado con error
      let empleadosView = [];
      try {
        const empleados = await buscarEmpleados({});
        empleadosView = empleados.map((e) => ({
          ...e,
          id: e._id ? String(e._id) : "",
        }));
      } catch {}

      res.render("empleados/listado", {
        empleados: empleadosView,
        error: error.message,
        ROLES: this.ROLES,
        AREAS: this.AREAS,
      });
    }
  };
}

export default new EmpleadosController();
