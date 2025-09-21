import EmpleadosModel from "./empleados.model.js";

const model = new EmpleadosModel();

class EmpleadosController {
  // CRUD
  getEmpleados = (req, res) => {
    try {
      res.json(model.getAll());
    } catch (err) {
      res.status(500).json({ error: "Error al obtener empleados" });
    }
  };

  getEmpleado = (req, res) => {
    try {
      const emp = model.getById(req.params.id);
      if (!emp) return res.status(404).json({ error: "Empleado no encontrado" });
      res.json(emp);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener empleado" });
    }
  };

  addEmpleado = (req, res) => {
    try {
      const { id, nombre, apellido, dni, rol, area } = req.body;

      // Validación de campos obligatorios
      if (!nombre || !apellido || !dni || !rol || !area) {
        return res
          .status(400)
          .json({ error: "Campos obligatorios: nombre, apellido, dni, rol, area" });
      }

      const nuevo = model.create({ id, nombre, apellido, dni, rol, area });
      if (!nuevo) {
        // Conflicto por id o dni repetido
        return res.status(409).json({ error: "ID o DNI ya existente" });
      }

      res.status(201).json(nuevo);
    } catch (err) {
      res.status(500).json({ error: "Error al crear empleado" });
    }
  };

  editEmpleado = (req, res) => {
    try {
      const emp = model.update(req.params.id, req.body);
      if (!emp) return res.status(404).json({ error: "Empleado no encontrado o DNI en uso" });
      res.json(emp);
    } catch (err) {
      res.status(400).json({ error: "Error al actualizar empleado" });
    }
  };

  removeEmpleado = (req, res) => {
    try {
      const ok = model.remove(req.params.id);
      if (!ok) return res.status(404).json({ error: "Empleado no encontrado" });
      res.json({ message: "Empleado eliminado" });
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar empleado" });
    }
  };

  // Filtros
  getEmpleadosByRol = (req, res) => {
    try {
      const { rol } = req.params;
      res.json(model.filterByRol(rol));
    } catch (err) {
      res.status(500).json({ error: "Error al filtrar por rol" });
    }
  };

  getEmpleadosByArea = (req, res) => {
    try {
      const { area } = req.params;
      res.json(model.filterByArea(area));
    } catch (err) {
      res.status(500).json({ error: "Error al filtrar por área" });
    }
  };
}

export default new EmpleadosController(); 
