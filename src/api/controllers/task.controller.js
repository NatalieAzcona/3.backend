//CRUD Create, Read, Update, Delete

const Task = require("../models/Task");

const getTask = async (req, res, next) => {  //consulta a la bbdd
    try {
        const tasks = await Task.find()     //.find para encontrar
        return res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "error al obtener tasks", error
        });
    }
}

//Creando el task con new
const postTask = async (req, res, next) => {
    try {
        const newTask = new Task(req.body);     //req.body para crear en el cuerpo
        const taskSaved = await newTask.save(); //.save para guardar en la bbdd
        return res.status(201).json(taskSaved);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Error al crear task", error,
        })
    }
}

/* Cuando creas tast con create
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
        return res.status(200).json({
            message: "eliminamos esta task", 
            elemento: taskDeleted
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json("error")
    }
}

 

module.exports = {getTask, postTask, updateTask, deleteTask}; 