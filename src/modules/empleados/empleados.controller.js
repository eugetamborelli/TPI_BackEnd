import {
    buscarEmpleados,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    getEmpleadoById,
  } from "./empleados.model.js";
  
  import { ROLES, AREAS } from "./empleados.utils.js"; 
  
  class EmpleadosController {
  
    // *** Views ***
  
    renderDashboard = (req, res) => {
      return res.render("empleados/dashboard", { titulo: "Gestión de Empleados" });
    };
  
    renderNuevoEmpleado = (req, res) => {
      return res.render("empleados/nuevoEmpleado", {
        titulo: "Alta de empleado",
        formData: req.query || {}, 
        roles: ROLES,
        areas: AREAS,
      });
    };
      
    // Simplifica el mapeo de _id a id para la vista
    _mapToView = (empleados) => {
        if (!empleados) return [];
        return empleados.map((e) => ({
            ...e,
            id: e._id ? String(e._id) : "",
        }));
    };
  
    // *** Listado + filtros  ***
  
    getEmpleadosListado = async (req, res) => {
      const rawDni = req.query.dni ?? "";
      const rawRol = req.query.rol ?? "";
      const successMsg = req.query.msg;
  
      const dni = String(rawDni).trim();
      const rol = String(rawRol).trim();
      const error = req.query.error;
  
      try {
        const empleados = await buscarEmpleados({ dni, rol });
  
        return res.render("empleados/listado", {
          empleados: this._mapToView(empleados),
          dniBusqueda: dni,
          rolBusqueda: rawRol,
          roles: ROLES,
          areas: AREAS,
          successMsg: successMsg, 
          error: error,
        });
      } catch (err) {
        return res.render("empleados/listado", {
          empleados: [],
          error: `Error interno al cargar la lista: ${err.message}`,
          dniBusqueda: dni,
          rolBusqueda: rawRol,
          roles: ROLES,
          areas: AREAS,
        });
      }
    };
  
    // *** CRUD ***
  
    addEmpleado = async (req, res) => {
      try {

        const payload = { ...req.body };
        if (payload.activo === 'on' || payload.activo === true) {
          payload.activo = true;
        } else {
          payload.activo = false;
        }
        
        const nuevoEmpleado = await createEmpleado(payload);
  
        return res.redirect(`/empleados/listado?msg=Empleado%20${nuevoEmpleado.legajo}%20creado%20con%20éxito.`);
      } catch (error) {
        let errorMessage = error.message;
        if (error.name === 'ValidationError') {
            errorMessage = Object.values(error.errors).map(val => val.message).join(' | ');
        }
  
        return res.status(400).render("empleados/nuevoEmpleado", {
          error: errorMessage,
          formData: req.body || {},
          roles: ROLES,
          areas: AREAS,
        });
      }
    };
  
    renderEditarEmpleado = async (req, res) => {
      try {
        const { id } = req.params;
        const empleado = await getEmpleadoById(id);
  
        if (!empleado) return res.redirect("/empleados/listado?error=Empleado no encontrado.");
  
        const empleadoView = {
          ...empleado,
          id: empleado._id ? String(empleado._id) : "",
        };
  
        return res.render("empleados/editarEmpleado", {
          empleado: empleadoView,
          roles: ROLES,
          areas: AREAS,
        });
      } catch (error) {
        return res.redirect(`/empleados/listado?error=Error al cargar la edición: ${error.message}`);
      }
    };
  
    updateEmpleado = async (req, res) => {
      const { id } = req.params;
      const { password, ...payload } = { ...req.body }; 
  
      try {
          if (password) {
              payload.password = password;
          }
          if ("legajo" in payload) {
              delete payload.legajo;
          }
          if (Object.prototype.hasOwnProperty.call(req.body, "activo")) {
              payload.activo = !!req.body.activo;
          }
          
          const empActualizado = await updateEmpleado(id, payload);
  
          if (!empActualizado) {
              return res.status(404).redirect(`/empleados/listado?error=Empleado con ID ${id} no encontrado.`);
          }
  
          return res.redirect(`/empleados/listado?msg=Empleado%20${empActualizado.legajo}%20actualizado%20con%20éxito.`);
  
      } catch (error) {
          console.error("Error al actualizar empleado:", error);
          
          let errorMessage = error.message;
          if (error.name === 'ValidationError') {
              errorMessage = Object.values(error.errors).map(val => val.message).join(' | ');
          }
          
          const empleadoOriginal = await getEmpleadoById(id);
          
          return res.status(400).render("empleados/editarEmpleado", {
              titulo: `Error al editar #${id}`,
              error: errorMessage,
              empleado: { ...empleadoOriginal, ...req.body, id }, 
              roles: ROLES,
              areas: AREAS,
          });
      }
    };
  
    deleteEmpleado = async (req, res) => {
      const { id } = req.params; 
  
      try {
          const ok = await deleteEmpleado(id);
  
          if (!ok) {
              return res.status(404).redirect(`/empleados/listado?error=Empleado ${id} no encontrado para la eliminación.`);
          }
  
          return res.redirect(`/empleados/listado?msg=Empleado%20${id}%20eliminado%20correctamente.`);
          
      } catch (error) {
          console.error("Error al eliminar empleado:", error);
          return res.status(500).redirect(`/empleados/listado?error=Error interno al eliminar el empleado: ${error.message}`);
      }
    };
  }
  
  export default new EmpleadosController();