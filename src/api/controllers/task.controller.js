const Task = require("../models/Task");


//Get - Todas las tasks
const getTask = async (req, res, next) => {  //consulta a la bbdd
    try {
        const tasks = await Task.find().populate("user", "name email role") // con el segundo param evito que me pase password    
        return res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "error al obtener tasks", error
        });
    }
}

// Get tareas por usuario

const getTasksByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;   /// TIENE QUE SER EL ID DEL USUARIO PARA QUE TENGA SENTIDO!!! AAA
        const tasks = await Task.find({user: userId}).populate(
            "user",
            "name email role"
        );
        return res.status(200).json(tasks)
    } catch (error) {
        return res.status(500).json("no se encontró la tarea asignada", error)
    }
}

// Get por el id de la misma tarea

const getTaskById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const task = await Task.findById(id).populate("user", "name email role")
        if (!task) {
            return res.status(404).json({ message: "task no encontrada" });
          }
        return res.status(200).json(task);
        } catch (error) {
          return res.status(500).json({
            message: "error al obtener la task",
            error,
          });
        }  
};


//Creando el task con new
const postTask = async (req, res, next) => {
    try {
        const newTask = new Task(req.body);     // para crear en el cuerpo
        const taskSaved = await newTask.save(); //.save para guardar en la bbdd
        return res.status(201).json(taskSaved);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Error al crear task", error,
        })
    }
}

/* Cuando creas task con create
const postTask = async (req, res, next) => {
    try {
        const { user, task, time } = req.body;
        const newTask = await Task.create({user, task, time})
        return res.status(201).json(newTask)
    } catch (error) {
        return res.status(500).json({
        message: "error al crear task",
        error
        })
    }
}
*/

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
                message: "task not found"
            })
        }
        return res.status(200).json(taskUpdated);
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            message: "task can't be updated",
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
              message: "task not found",
            });
          }

        return res.status(200).json({
            message: "eliminamos esta task", 
            elemento: taskDeleted
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json("error")
    }
}

 

module.exports = {getTask, getTasksByUser, getTaskById, postTask, updateTask, deleteTask}; 