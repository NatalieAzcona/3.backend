const express = require("express");
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/user.controller")

//tengo que agregar arriba el changeRole de userControl 

const userRouter = express.Router();

//Creo mi rutas
userRouter.get("/", getUsers);         
userRouter.get("/:id", getUserById);   
userRouter.post("/", createUser);     
userRouter.put("/:id", updateUser);   
userRouter.delete("/:id", deleteUser);

// Necesito ruta para cambiar rol desde admin

// userRouter.patch("/:id/role", changeRole) // Esto no lo tengo claro!!! INVESTIGAR

module.exports = userRouter;