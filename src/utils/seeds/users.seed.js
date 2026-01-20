require("dotenv").config();
const mongoose = require("mongoose");
const User = require ("../../api/models/User.js")
const users = require ("../../data/users.js")


const setSeed = async () => { 
   try {
    await mongoose.connect(process.env.DB_URL)
    console.log("conectado a la bbdd para inyectar seed de usuarios")

    //elimino lo que tengo
    const allUsers = await User.find()

    if (allUsers.length > 0) {
        await User.collection.drop()
        }

    for(const u of users) {
        const newUser = new User(u)
        await newUser.save() //necesito el pre save para la pass
    }

    await mongoose.disconnect()
    console.log("desconectado de la bbdd, seed de usuarios inyectada")
} catch (error) {
    console.log("Error en la seed de users", error)
}
}
setSeed();


module.exports = {setSeed}