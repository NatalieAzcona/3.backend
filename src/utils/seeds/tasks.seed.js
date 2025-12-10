require("dotenv").config();
const mongoose = require("mongoose");

const Task = require ("../../api/models/Task.js")
const tasks = require ("../../data/tasks.js")
const User = require ("../../api/models/User.js")

const setTaskSeed = async () => {
    try {
        await mongoose.connect (process.env.DB_URL)
        console.log ("conectado a la bbdd para inyectar seed de tareas")

        //limpio mis tasks
        
        const allTasks = await Task.find()
        if (allTasks.length > 0) {
            await Task.collection.drop()
        }

        for (const t of tasks) {
            const user = await User.findOne({email: t.email})

        if(!user) {
            console.log (`usuario no encontrado con el email ${t.email}`);   
        }

        const newTask = new Task ({
            task: t.task,
            time: t.time,
            user: user._id
        })

        const savedTask = await newTask.save();

        if(!user.tasks.includes(savedTask._id)) {
            user.tasks.push(savedTask._id);
            await user.save();
        }
    }

        await mongoose.disconnect()
        console.log ("desconectado de la bbdd, seed de tareas inyectada")
    } catch (error) {
        console.log ("error en la seed de tasks", error)
    }
}

setTaskSeed();