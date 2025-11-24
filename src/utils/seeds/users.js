const mongoose = require("mongoose");
const User = require ("../../api/models/User.js")
const users = require ("../../data/usersSeed.js")


const setSeed = async () => { 
   try {
    await mongoose.connect("mongodb+srv://natalieazcona_db_user:h6JDk9RMJ6k4mu8W@cluster0.krgrqan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
   
    await User.collection.drop()
    await User.insertMany(users)

    await mongoose.disconnect()
} catch (error) {
    console.log("error")
}
}

  //para inyectar los ejemplos de prueba, repasar modulo Seeds

  module.exports = {setSeed}