const Task = require("../models/Task");
const User = require("../models/User");


//Get - Todas las tasks
const getTask = async (req, res, next) => {  
    try {
        const tasks = await Task.find().populate("user", "name email role") // con el segundo param evito que me pase password    
        return res.status(200).json(tasks);
    } catch (error) {;
        return res.status(500).json({
            message: "error al obtener tasks", error
        });
    }
}

// Get tareas por usuario
const getTasksByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;   /// TIENE QUE SER EL ID DEL USUARIO
        const tasks = await Task.find({user: userId}).populate(
            "user",
            "name email role"
        );
        return res.status(200).json(tasks)
    } catch (error) {
        return res.status(500).json({message: "No se encontró la tarea asignada", error})
    }
}

// Get por el ID DE LA TAREA
const getTaskById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const task = await Task.findById(id).populate("user", "name email role")
        if (!task) {
            return res.status(404).json({ message: "Task no encontrada" });
          }
        return res.status(200).json(task);
        } catch (error) {
          return res.status(500).json({
            message: "Error al obtener la task",
            error,
          });
        }  
};

//Creando el task con new
const postTask = async (req, res, next) => {
    try {
        const {user, task, time} = req.body;

        if (!user) {
            return res.status(400).json({ message: "Falta el id de usuario" });
        }

        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(404).json({ message: "User no encontrado" });
        }

        const newTask = new Task({user, task, time});     
        const taskSaved = await newTask.save(); 
        
        const userUpdated = await User.findByIdAndUpdate(
            user, {
                $addToSet: { tasks: taskSaved._id } // addtoset agrega si no está, no borra
            },
        )
        return res.status(201).json(taskSaved);
    } catch (error) {;
        return res.status(400).json({
            message: "Error al crear task", error,
        })
    }
}

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        const taskUpdated = await Task.findByIdAndUpdate(
            id, 
            { $set: req.body }, // $set cambia valores
            { new: true, runValidators: true} //me devuelve lo actualziado y según schema
        );
        if (!taskUpdated) {
            return res.status(404).json({
                message: "Error al encontrar la task"
            })
        }
        return res.status(200).json(taskUpdated);
    } catch(error) {;
        return res.status(400).json({
            message: "Error al actualizar la task",
            error
        })
    }
}

const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const taskDeleted = await Task.findByIdAndDelete(id);
        if (!taskDeleted) {
            return res.status(404).json({
              message: "No se encuentra la task",
            });
          }

        if (taskDeleted.user) {
            await User.findByIdAndUpdate(
                taskDeleted.user,
                { $pull: { tasks: taskDeleted._id } } //pull quita del array
            );
        }
        return res.status(200).json({
            message: "Task eliminada", 
            elemento: taskDeleted
        })
    } catch (error) {
        return res.status(400).json("error")
    }
}

 

module.exports = {getTask, getTasksByUser, getTaskById, postTask, updateTask, deleteTask}; 