require("dotenv").config();

const express = require("express"); 
const { connectDB } = require("./src/config/db")

const app = express();   
const PORT = process.env.PORT || 3000; //tomo de dotenv

app.use(express.json());

connectDB();

// Rutas
const userRoutes = require("./src/api/routes/user.routes");
const taskRoutes = require("./src/api/routes/task.routes");

app.use("/api/v1/users", userRoutes);  
app.use("/api/v1/tasks", taskRoutes);

/* app.use("*", (req, res, next) => {
  return res.status(404).json("Route not found :)")
}) */ //Esto para controlar las rutas que no estén definidas, pero no me funciona

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`);
});

