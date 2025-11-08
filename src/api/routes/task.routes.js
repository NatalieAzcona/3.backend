const express = require("express");
const {getTask, postTask, updateTask, deleteTask} = require("../controllers/task.controller")

//Creo mi ruta
const taskRouter = express.Router();

taskRouter.get("/", getTask);
taskRouter.post("/", postTask);
taskRouter.put("/:id", updateTask); 
taskRouter.delete("/:id", deleteTask);



module.exports = taskRouter;

