const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creo mi esquema de User

const userSchema = new Schema (
    {
        name: {type: String, required: true, trim: true},
        email: {type: String, required: true, trim: true},
        password: {type: String, required: true},
        role: {type: String, enum: ["user", "admin"], default: "user"},
    },
    {
        timestamps: true,
    }
)

//Model
const User = mongoose.model('users', userSchema, "users");

module.exports = User;