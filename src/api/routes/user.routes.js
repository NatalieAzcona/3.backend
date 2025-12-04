const express = require("express");
const { registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser, changeRole } = require("../controllers/user.controller")
const { isAuth, isAdmin } = require('../../middlewares/auth')
const { upload } = require('../../middlewares/cloudinary');

const userRouter = express.Router();

//Creo mi rutas
userRouter.get("/", isAuth, isAdmin, getUsers);          
userRouter.get("/:id", isAuth, getUserById);   
userRouter.post("/register", upload.single('image'), registerUser);
userRouter.post('/login', loginUser);
userRouter.put("/:id", isAuth, upload.single('image'), updateUser); 
userRouter.delete("/:id", isAuth, deleteUser); 
userRouter.patch("/:id/role", isAuth, isAdmin, changeRole);

module.exports = userRouter;