import EmpleadosModel from "./empleados.model.js";
import BaseController from "../../common/base/base.controller.js";

// Listas predeterminadas
const ROLES = [
  "médico", "enfermera", "recepcionista", "administrador",
  "encargado de stock", "laboratorista", "kinesiólogo"
];

const AREAS = [
  "Atención Médica", "Pediatría", "Emergencias", "Administración de Turnos",
  "Facturación", "Stock de Insumos", "Laboratorio", "Enfermería"
];

class EmpleadosController extends BaseController {
    constructor() {
        super(new EmpleadosModel());
        this.ROLES = ROLES;
        this.AREAS = AREAS;
    }

    // Resuelve si el ID es numérico o DNI y retorna el empleado.
    async _findEmpleado(id) {
        let empleado = null;
        if (!isNaN(id)) {
            empleado = await this.model.getById(Number(id));
        }

        if (!empleado) {
            empleado = await this.model.getByDni(id);
        }
        return empleado;
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
            AREAS: this.AREAS 
        });
    };
    
    // --- Listado y Filtro  ---

    getEmpleadosListado = async (req, res) => {
        try {
            let empleados = await this.model.getAll();

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
                ROLES: this.ROLES,
                AREAS: this.AREAS
            });
        } catch (error) {
            res.render("empleados/listado", {
                empleados: [],
                error: error.message,
                dniBusqueda: req.query.dni ?? "",
                rolBusqueda: req.query.rol ?? "",
                ROLES: this.ROLES,
                AREAS: this.AREAS
            });
        }
    };

    // --- CRUD ---

    addEmpleado = async (req, res) => {
        try {
            const {
                nombre, apellido, dni, rol, area
            } = req.body;

            if (!this.ROLES.includes(rol)) {
                throw new Error("Rol inválido");
            }
            if (!this.AREAS.includes(area)) {
                throw new Error("Área inválida");
            }

            await this.model.create({
                ...req.body,
                activo: !!req.body.activo,
                telefono: req.body.telefono || "",
                email: req.body.email || "",
                fechaAlta: req.body.fechaAlta || "",
            });

            res.redirect("/empleados/listado");
        } catch (error) {
            res.status(400).render("empleados/nuevoEmpleado", {
                error: error.message,
                formData: req.body || {},
                ROLES: this.ROLES,
                AREAS: this.AREAS
            });
        }
    };

    renderEditarEmpleado = async (req, res) => {
        try {
            const { id } = req.params;
            const empleado = await this._findEmpleado(id);

            if (!empleado) return res.redirect("/empleados/listado");
            
            res.render("empleados/editarEmpleado", { 
                empleado, 
                ROLES: this.ROLES, 
                AREAS: this.AREAS 
            });
        } catch {
            res.redirect("/empleados/listado");
        }
    };

    updateEmpleado = async (req, res) => {
        const { id } = req.params;
        const target = await this._findEmpleado(id);

        if (!target) {
            return res.status(400).render("empleados/editarEmpleado", {
                error: "Empleado no encontrado",
                empleado: { id, ...req.body },
                ROLES: this.ROLES, 
                AREAS: this.AREAS
            });
        }
        
        try {
            const payload = { ...req.body };
            
            if (Object.prototype.hasOwnProperty.call(payload, "activo")) {
                payload.activo = !!payload.activo;
            }

            if (payload.rol && !this.ROLES.includes(payload.rol)) {
                throw new Error("Rol inválido");
            }
            if (payload.area && !this.AREAS.includes(payload.area)) {
                throw new Error("Área inválida");
            }
            
            const emp = await this.model.update(target.id, payload);
            
            if (!emp) {
                throw new Error("Error al actualizar (DNI en uso o datos inválidos)");
            }
            
            res.redirect("/empleados/listado");
        } catch (error) {
            res.status(400).render("empleados/editarEmpleado", {
                error: error.message,
                empleado: { id: target.id, ...req.body }, 
                ROLES: this.ROLES, 
                AREAS: this.AREAS
            });
        }
    };

    deleteEmpleado = async (req, res) => {
        try {
            const { id } = req.params;
            const target = await this._findEmpleado(id);

            if (!target) {
                throw new Error("Empleado no encontrado para la eliminación");
            }
            
            const ok = await this.model.remove(target.id);
            
            if (!ok) {
                throw new Error("No se pudo eliminar el empleado");
            }

            res.redirect("/empleados/listado");
        } catch (error) {
            res.render("empleados/listado", {
                empleados: await this.model.getAll(),
                error: error.message,
                ROLES: this.ROLES, 
                AREAS: this.AREAS
            });
        }
    };
}

export default new EmpleadosController();