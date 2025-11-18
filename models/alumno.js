import mongoose from "mongoose";

const alumnoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  matricula: { type: String, required: true, unique: true },
  carrera: { type: String, required: true }
});

export default mongoose.model("Alumno", alumnoSchema);
