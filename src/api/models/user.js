const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

//Creo mi esquema de User

const userSchema = new Schema (
    {
        name: {type: String, required: true, trim: true},
        email: {type: String, required: true, unique: true, lowercase: true, trim: true}, //unique para no dulplicar email
        password: {type: String, required: true, trim: true, minlength: [8, "8 caracteres mínimo"]},
        role: {type: String, enum: ["user", "admin"], default: "user"},
        image: {type: String, required: true},
        tasks: [{type: Schema.Types.ObjectId, ref: "tasks"}]
    },
    {
        timestamps: true,
    }
)

// estoy encriptando la contraseña 
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next() //para no hashear dos veces

    this.password = bcrypt.hashSync(this.password, 10) //se encripta antes de guardar en bbdd y lo llamo en controller con el save
    next()
} )


//Model
const User = mongoose.model('users', userSchema, "users");  // el primer "users" es el nombre del modelo, el tercero es el ref de MongoDB

module.exports = User;