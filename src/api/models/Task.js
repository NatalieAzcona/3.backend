const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creo mi esquema de tasks con mongoose

const taskSchema = new Schema (
    {user: {type: Schema.Types.ObjectId, ref: "users", required: true}, // también se puede mongoose.Types.ObjectId
    task: {type: String, enum: ["write", "edit", "publish", "design"], required: true},
    time: {type: Number, required: true, min: 0}
    },
    {timestamps: true}
);

// Modelo
const Task = mongoose.model("tasks", taskSchema, "tasks");

module.exports = Task;
