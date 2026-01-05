require('dotenv').config();  

const mongoose = require('mongoose'); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL) 
        console.log('Base de datos conectada')
    } catch (error) {
        console.log('Error al conectar la base de datos', error)
    }
}

module.exports = {connectDB};
