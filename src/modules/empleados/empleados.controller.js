// src/modules/empleados/empleados.controller.js
import EmpleadosModel from "./empleados.model.js";
const model = new EmpleadosModel();

// Listas predeterminadas (sin archivo extra)
const ROLES = [
  "médico", "enfermera", "recepcionista", "administrador",
  "encargado de stock", "laboratorista", "kinesiólogo"
];

const AREAS = [
  "Atención Médica", "Pediatría", "Emergencias", "Administración de Turnos",
  "Facturación", "Stock de Insumos", "Laboratorio", "Enfermería"
];

// MENÚ
export const renderDashboard = (req, res) => {
  res.render("empleados/dashboard", { titulo: "Gestión de Empleados" });
};

// LISTADO (DNI tiene prioridad sobre ROL) + pasamos ROLES para el filtro select
export const getEmpleadosListado = (req, res) => {
  try {
    let empleados = model.getAll();

    const rawDni = req.query.dni ?? "";
    const rawRol = req.query.rol ?? "";

    const dni = String(rawDni).trim();
    const rol = String(rawRol).trim().toLowerCase();

    if (dni) {
      empleados = empleados.filter((e) => String(e.dni) === dni);
    } else if (rol) {
      empleados = empleados.filter((e) => (e.rol || "").toLowerCase() === rol);
    }

    res.render("empleados/listado", {
      empleados,
      dniBusqueda: dni,
      rolBusqueda: rawRol,
      ROLES,
      AREAS
    });
  } catch (error) {
    res.render("empleados/listado", {
      empleados: [],
      error: error.message,
      dniBusqueda: req.query.dni ?? "",
      rolBusqueda: req.query.rol ?? "",
      ROLES,
      AREAS
    });
  }
};

// NUEVO (form) — pasamos ROLES y AREAS para los <select>
export const renderNuevoEmpleado = (req, res) => {
  res.render("empleados/nuevo-empleado", { titulo: "Alta de empleado", formData: {}, ROLES, AREAS });
};

// CREAR (POST) — validamos que rol/area estén en las listas
export const addEmpleado = (req, res) => {
  try {
    const {
      nombre, apellido, dni, rol, area, telefono, email, fechaAlta
    } = req.body;
    const activo = !!req.body.activo;

    if (!nombre || !apellido || !dni || !rol || !area) {
      return res.status(400).render("empleados/nuevo-empleado", {
        error: "Campos obligatorios: nombre, apellido, dni, rol, area",
        formData: req.body || {},
        ROLES, AREAS
      });
    }
    if (!ROLES.includes(rol)) {
      return res.status(400).render("empleados/nuevo-empleado", {
        error: "Rol inválido",
        formData: req.body || {},
        ROLES, AREAS
      });
    }
    if (!AREAS.includes(area)) {
      return res.status(400).render("empleados/nuevo-empleado", {
        error: "Área inválida",
        formData: req.body || {},
        ROLES, AREAS
      });
    }

    model.create({
      nombre, apellido, dni, rol, area,
      telefono: telefono || "",
      email: email || "",
      fechaAlta: fechaAlta || "",
      activo
    });

    res.redirect("/empleados/listado");
  } catch (error) {
    res.status(400).render("empleados/nuevo-empleado", {
      error: error.message,
      formData: req.body || {},
      ROLES, AREAS
    });
  }
};

// EDITAR (form) — acepta :id como ID numérico o como DNI
export const renderEditarEmpleado = (req, res) => {
  try {
    const { id } = req.params;
    let empleado = null;

    // Si es número válido, intento por ID
    if (!isNaN(id)) {
      empleado = model.getById(Number(id));
    }
    // Si no encontré o no era número, intento por DNI
    if (!empleado) {
      empleado = model.getByDni(id);
    }

    if (!empleado) return res.redirect("/empleados/listado");
    res.render("empleados/editarEmpleado", { empleado, ROLES, AREAS });
  } catch {
    res.redirect("/empleados/listado");
  }
};

// ACTUALIZAR (PATCH) — también acepta :id como ID o DNI
export const updateEmpleado = (req, res) => {
  try {
    const { id } = req.params;
    let target = null;

    if (!isNaN(id)) {
      target = model.getById(Number(id));
    }
    if (!target) {
      target = model.getByDni(id);
    }
    if (!target) {
      return res.status(400).render("empleados/editarEmpleado", {
        error: "Empleado no encontrado",
        empleado: { id, ...req.body },
        ROLES, AREAS
      });
    }

    const payload = { ...req.body };
    if (Object.prototype.hasOwnProperty.call(payload, "activo")) {
      payload.activo = !!payload.activo; // checkbox → boolean
    }

    if (payload.rol && !ROLES.includes(payload.rol)) {
      return res.status(400).render("empleados/editarEmpleado", {
        error: "Rol inválido",
        empleado: { id: target.id, ...req.body },
        ROLES, AREAS
      });
    }
    if (payload.area && !AREAS.includes(payload.area)) {
      return res.status(400).render("empleados/editarEmpleado", {
        error: "Área inválida",
        empleado: { id: target.id, ...req.body },
        ROLES, AREAS
      });
    }

    const emp = model.update(target.id, payload);
    if (!emp) {
      return res.status(400).render("empleados/editarEmpleado", {
        error: "DNI en uso o empleado no encontrado",
        empleado: { id: target.id, ...req.body },
        ROLES, AREAS
      });
    }
    res.redirect("/empleados/listado");
  } catch (error) {
    res.status(400).render("empleados/editarEmpleado", {
      error: error.message,
      empleado: { id: req.params.id, ...req.body },
      ROLES, AREAS
    });
  }
};


// ELIMINAR (DELETE)
export const deleteEmpleado = (req, res) => {
  try {
    const ok = model.remove(req.params.id);
    if (!ok) {
      return res.render("empleados/listado", {
        empleados: model.getAll(),
        error: "Empleado no encontrado",
        ROLES, AREAS
      });
    }
    res.redirect("/empleados/listado");
  } catch (error) {
    res.render("empleados/listado", {
      empleados: [],
      error: error.message,
      ROLES, AREAS
    });
  }
};
