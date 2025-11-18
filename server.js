import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import alumnoRoutes from "./routes/alumnoRoutes.js";
import os from "os";

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));


app.use("/api/alumnos", alumnoRoutes);

const PORT = process.env.PORT || 3000;


const getLocalIP = () =>
  Object.values(os.networkInterfaces())
    .flat()
    .find((iface) => iface.family === "IPv4" && !iface.internal)?.address || "localhost";

const IP = getLocalIP();


app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en:`);
  console.log(`🌍 PC:        http://localhost:${PORT}`);
  console.log(`📱 Emulador: http://10.0.2.2:${PORT}`);
  console.log(`📡 Celular:  http://${IP}:${PORT}`);
  console.log(`📌 Ruta API: http://${IP}:${PORT}/api/alumnos`);
});
