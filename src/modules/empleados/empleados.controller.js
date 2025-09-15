import {
  getAllEmpleados,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
} from "./empleados.model.js";

// CRUD
export const getEmpleados = (req, res) => {
  res.json(getAllEmpleados());
};

export const getEmpleado = (req, res) => {
  const emp = getEmpleadoById(req.params.id);
  if (!emp) return res.status(404).json({ error: "Empleado no encontrado" });
  res.json(emp);
};

export const addEmpleado = (req, res) => {
  const { id, nombre, apellido, dni, rol, area } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !apellido || !dni || !rol || !area) {
    return res
      .status(400)
      .json({ error: "Campos obligatorios: nombre, apellido, dni, rol, area" });
  }

  // Crear empleado (permitiendo id manual)
  const nuevo = createEmpleado({ id, nombre, apellido, dni, rol, area });

  if (!nuevo) {
    // Conflicto por id o dni repetido
    return res.status(409).json({ error: "ID o DNI ya existente" });
  }

  res.status(201).json(nuevo);
};

export const editEmpleado = (req, res) => {
  const emp = updateEmpleado(req.params.id, req.body);
  if (!emp) return res.status(404).json({ error: "Empleado no encontrado" });
  res.json(emp);
};

export const removeEmpleado = (req, res) => {
  const ok = deleteEmpleado(req.params.id);
  if (!ok) return res.status(404).json({ error: "Empleado no encontrado" });
  res.json({ message: "Empleado eliminado" });
};

// Filtros
export const getEmpleadosByRol = (req, res) => {
  const { rol } = req.params;
  const empleados = getAllEmpleados();
  const filtrados = empleados.filter(
    (e) => (e.rol || "").toLowerCase() === rol.toLowerCase()
  );
  res.json(filtrados);
};

export const getEmpleadosByArea = (req, res) => {
  const { area } = req.params;
  const empleados = getAllEmpleados();
  const filtrados = empleados.filter(
    (e) => (e.area || "").toLowerCase() === area.toLowerCase()
  );
  res.json(filtrados);
};
