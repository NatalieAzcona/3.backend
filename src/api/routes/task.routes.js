const express = require("express");
const {getTask, getTasksByUser, getTaskById, postTask, updateTask, deleteTask} = require("../controllers/task.controller")

const taskRouter = express.Router();

taskRouter.get("/", getTask);
taskRouter.get("/user/:userId", getTasksByUser);
taskRouter.get("/:id", getTaskById);
taskRouter.post("/", postTask);
taskRouter.put("/:id", updateTask); 
taskRouter.delete("/:id", deleteTask);



module.exports = taskRouter;

