require('dotenv').config();  //dotenv carga mis variables de entorno, carga mi .env

const mongoose = require('mongoose'); //librería para conectar con MongoDB

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)  // conecta mmi db del .env; dotenv pone todas mis variables de .env en process.env
        console.log('Database connected')
    } catch (error) {
        console.log('Error connecting database', error)
    }
}

module.exports = {connectDB}; //exporto para usar 
