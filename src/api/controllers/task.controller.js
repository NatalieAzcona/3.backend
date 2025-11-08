//CRUD Create, Read, Update, Delete

const Task = require("../models/Task");

const getTask = async (req, res, next) => {  //consulta a la bbdd
    try {
        const tasks = await Task.find()     //.find para encontrar
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(400).json(error);
    }
}

//Estoy probando con el postTasks, tengo que confirmar
const postTask = async (req, res, next) => {
    try {
        const newTask = new Task(req.body);     //req.body para crear en el cuerpo
        const taskSaved = await newTask.save(); //.save para guardar
        return res.status(201).json(taskSaved);
    } catch (error) {
        return res.status()
    }
}


//Esto para consultar tambien 
const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;       //.params para los parámetros
        const newTask = new Task(req.body);   // si creo una new task y le pongo el mismo id, se actualiza
        newTask._id = id;
        const taskUpdated = await Task.findByIdAndUpdate(id, newTask, {
            new: true,
        });
        return res.status(200).json(taskUpdated)
    } catch (error) {
        return res.status(400).json("error")
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
        return res.status(400).json("error")
    }
}

 

module.exports = {getTask, postTask, updateTask, deleteTask};  //exporto