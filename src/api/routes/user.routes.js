const express = require("express");
const { registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser } = require("../controllers/user.controller")
const { isAuth } = require('../../middlewares/auth')
//tengo que agregar arriba el changeRole de userControl 

const userRouter = express.Router();

//Creo mi rutas
userRouter.get("/", isAuth, getUsers);          
userRouter.get("/:id", isAuth, getUserById);   
userRouter.post("/register", registerUser);// no tiene sentido el auth antes
userRouter.post('/login', loginUser); // no tiene sentido el auth antes
userRouter.put("/:id", isAuth, updateUser);  
userRouter.delete("/:id", isAuth, deleteUser); 

//userRouter.patch("/:id/role", isAuth, changeRole); //
// Necesito ruta para cambiar rol desde admin

// userRouter.patch("/:id/role", changeRole) // Esto no lo tengo claro!!! INVESTIGAR

module.exports = userRouter;