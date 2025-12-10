const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema (
    {user: {type: Schema.Types.ObjectId, ref: "users", required: true}, 
    task: {type: String, enum: ["write", "edit", "publish", "design", "admin"], required: true},
    time: {type: Number, required: true, min: 0}
    },
    {timestamps: true}
);

// Modelo
const Task = mongoose.model("tasks", taskSchema, "tasks");

module.exports = Task;
