import express from "express";
import Alumno from "../models/alumno.js";

const router = express.Router();

// 🟢 POST → REGISTRAR ALUMNO
router.post("/registro", async (req, res) => {
  try {
    let { nombre, matricula, carrera } = req.body;

    nombre = nombre?.trim();
    matricula = matricula?.trim();
    carrera = carrera?.trim();

    if (!nombre || !matricula || !carrera) {
      return res.status(400).json({
        error: "campos_vacios",
        message: "Todos los campos son obligatorios",
      });
    }

    const existeMatricula = await Alumno.findOne({ matricula });
    if (existeMatricula) {
      return res.status(400).json({
        error: "matricula_existente",
        message: `La matrícula ${matricula} ya está registrada`,
      });
    }

    const nuevoAlumno = new Alumno({ nombre, matricula, carrera });
    await nuevoAlumno.save();

    console.log(`✅ Alumno registrado: ${nombre} (${matricula})`);

    res.json({ message: "Alumno registrado correctamente" });
  } catch (err) {
    console.error("❌ ERROR REGISTRO:", err.message);
    res.status(500).json({
      error: "error_servidor",
      message: err.message,
    });
  }
});

// 🟣 GET → LISTAR ALUMNOS (ORDENADOS)
router.get("/", async (req, res) => {
  try {
    // ordenados por nombre (puedes cambiar a { matricula: 1 } si prefieres)
    const alumnos = await Alumno.find().sort({ nombre: 1 });
    console.log(`📋 GET /alumnos → total: ${alumnos.length}`);
    res.json(alumnos);
  } catch (err) {
    console.error("❌ ERROR GET:", err.message);
    res.status(500).json({ error: "error_servidor", message: err.message });
  }
});

// 🔵 PUT → ACTUALIZAR POR MATRÍCULA
router.put("/:matricula", async (req, res) => {
  try {
    const { matricula } = req.params;
    const { nombre, carrera } = req.body;

    const actualizado = await Alumno.findOneAndUpdate(
      { matricula },                    // 👉 BUSCA POR MATRÍCULA
      { nombre, carrera },
      { new: true }                     // devuelve el alumno actualizado
    );

    if (!actualizado) {
      return res.status(404).json({
        error: "no_encontrado",
        message: `No existe alumno con matrícula ${matricula}`,
      });
    }

    console.log(`✏ Alumno actualizado: ${matricula}`);
    res.json({ message: "Alumno actualizado", alumno: actualizado });
  } catch (err) {
    console.error("❌ ERROR PUT:", err.message);
    res.status(500).json({ error: "error_servidor", message: err.message });
  }
});

// 🔴 DELETE → ELIMINAR POR MATRÍCULA
router.delete("/:matricula", async (req, res) => {
  try {
    const { matricula } = req.params;

    const eliminado = await Alumno.findOneAndDelete({ matricula }); // 👉 POR MATRÍCULA

    if (!eliminado) {
      return res.status(404).json({
        error: "no_encontrado",
        message: `No existe alumno con matrícula ${matricula}`,
      });
    }

    console.log(`🗑 Alumno eliminado: ${matricula}`);
    res.json({ message: "Alumno eliminado" });
  } catch (err) {
    console.error("❌ ERROR DELETE:", err.message);
    res.status(500).json({ error: "error_servidor", message: err.message });
  }
});

export default router;
