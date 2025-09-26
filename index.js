const express = require("express"); // express es mi mesero del restaurante
const { connectDB } = require("./src/config/db")

const app = express();     //por convención usamos app

connectDB();

app.use("/saludar", (req, res, next) => {
    return res.status(200).json("¡Hola! Esto funciona") //ejemplo de get /saludar
 })

app.listen(3000, () => {
    console.log("servidor 1 levantado en http://localhost:3000") // levantamos el servidor en 3000
})

