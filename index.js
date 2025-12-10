require("dotenv").config();
const cloudinary = require("cloudinary").v2;

const express = require("express"); 
const { connectDB } = require("./src/config/db")

const app = express();   
const PORT = process.env.PORT || 3000; 

app.use(express.json());

connectDB();

// Rutas
const userRoutes = require("./src/api/routes/user.routes");
const taskRoutes = require("./src/api/routes/task.routes");

app.use("/api/v1/users", userRoutes);  
app.use("/api/v1/tasks", taskRoutes);


// Servidor
app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`);
});

