// src/modules/insumos/insumos.controller.js
import InsumosModel from "./insumos.model.js";
const model = new InsumosModel();

class InsumosController {
  // CRUD
  getInsumos = (_req, res) => {
    try {
      res.json(model.getAll());
    } catch {
      res.status(500).json({ error: "Error al obtener insumos" });
    }
  };

  getInsumo = (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
      const item = model.getById(id);
      if (!item) return res.status(404).json({ error: "Insumo no encontrado" });
      res.json(item);
    } catch {
      res.status(500).json({ error: "Error al obtener insumo" });
    }
  };

  addInsumo = (req, res) => {
    try {
      const { nombre, categoria, unidad, stock, puntoReposicion, proveedor, codigo, costoUnitario } = req.body;
      if (!nombre || !categoria || !unidad) {
        return res.status(400).json({ error: "Campos obligatorios: nombre, categoria, unidad" });
      }
      const creado = model.create({ nombre, categoria, unidad, stock, puntoReposicion, proveedor, codigo, costoUnitario });
      res.status(201).json(creado);
    } catch (err) {
      if (String(err.message).includes("Código ya existente")) {
        return res.status(409).json({ error: err.message });
      }
      res.status(400).json({ error: err.message || "Error al crear insumo" });
    }
  };

  editInsumo = (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });

      const actualizado = model.update(id, req.body);
      if (!actualizado) return res.status(404).json({ error: "Insumo no encontrado" });
      if (actualizado.__conflict__) return res.status(409).json({ error: actualizado.__conflict__ });

      res.json(actualizado);
    } catch {
      res.status(400).json({ error: "Error al actualizar insumo" });
    }
  };

  removeInsumo = (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });

      const ok = model.remove(id);
      if (!ok) return res.status(404).json({ error: "Insumo no encontrado" });
      res.json({ message: "Insumo eliminado" });
    } catch {
      res.status(500).json({ error: "Error al eliminar insumo" });
    }
  };

  // Filtros
  getByCategoria = (req, res) => {
    try {
      res.json(model.filterByCategoria(req.params.categoria));
    } catch {
      res.status(500).json({ error: "Error al filtrar por categoría" });
    }
  };

  getByProveedor = (req, res) => {
    try {
      res.json(model.filterByProveedor(req.params.proveedor));
    } catch {
      res.status(500).json({ error: "Error al filtrar por proveedor" });
    }
  };

  getBajoStock = (_req, res) => {
    try {
      res.json(model.filterBajoStock());
    } catch {
      res.status(500).json({ error: "Error al filtrar bajo stock" });
    }
  };

  // Movimientos
  ingresoStock = (req, res) => {
    try {
      const id = Number(req.params.id);
      const { cantidad } = req.body;
      if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });

      const r = model.ingreso(id, cantidad);
      if (!r) return res.status(404).json({ error: "Insumo no encontrado" });
      if (r.__badqty__) return res.status(400).json({ error: "Cantidad inválida (debe ser > 0)" });

      res.json(r);
    } catch {
      res.status(400).json({ error: "Error en ingreso de stock" });
    }
  };

  egresoStock = (req, res) => {
    try {
      const id = Number(req.params.id);
      const { cantidad } = req.body;
      if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });

      const r = model.egreso(id, cantidad);
      if (!r) return res.status(404).json({ error: "Insumo no encontrado" });
      if (r.__badqty__) return res.status(400).json({ error: "Cantidad inválida (debe ser > 0)" });
      if (r.__nostock__) return res.status(409).json({ error: "Stock insuficiente" });

      res.json(r);
    } catch {
      res.status(400).json({ error: "Error en egreso de stock" });
    }
  };
}

export default new InsumosController();
