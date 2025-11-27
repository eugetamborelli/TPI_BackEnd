// src/modules/empleados/empleados.schema.js
import mongoose, { Schema } from "mongoose";
import ContadorLegajo from "./contadorLegajo.model.js";

const EmpleadoSchema = new Schema(
  {
    legajo: {
      type: Number,
      unique: true,
    },

    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
    },
    apellido: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
      maxlength: [100, "El apellido no puede exceder los 100 caracteres"],
    },
    dni: {
      type: String,
      required: [true, "El DNI es obligatorio"],
      trim: true,
      unique: true,
    },
    rol: {
      type: String,
      required: [true, "El rol es obligatorio"],
      trim: true,
    },
    area: {
      type: String,
      required: [true, "El área es obligatoria"],
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
    },
    fechaAlta: {
      type: String,
      trim: true,
      default: "",
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

EmpleadoSchema.pre("save", async function (next) {
  if (this.legajo != null) return next();

  try {
    let contador = await ContadorLegajo.findOne({ nombre: "legajo" });

    if (!contador) {
      contador = await ContadorLegajo.create({
        nombre: "legajo",
        valor: 0,
      });
    }

    contador.valor += 1;
    await contador.save();

    this.legajo = contador.valor;

    next();
  } catch (error) {
    next(error);
  }
});

const EmpleadoMongooseModel = mongoose.model("Empleado", EmpleadoSchema);

export default EmpleadoMongooseModel;