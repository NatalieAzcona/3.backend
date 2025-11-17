const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

//Creo mi esquema de User

const userSchema = new Schema (
    {
        name: {type: String, required: true, trim: true},
        email: {type: String, required: true, trim: true},
        password: {type: String, required: true, trim: true, minlegth: [8, "8 caracteres mínimo"]},
        role: {type: String, enum: ["user", "admin"], default: "user"},
    },
    {
        timestamps: true,
    }
)

// estoy encriptando la contraseña aquí
userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, 10)
    next()
} )


//Model
const User = mongoose.model('users', userSchema, "users");  // el primer "users" es el nombre del modelo, el tercero es el ref de MongoDB

module.exports = User;