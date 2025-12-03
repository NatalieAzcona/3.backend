require('dotenv').config();  

const mongoose = require('mongoose'); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)  // dotenv pone todas mis variables de .env en process.env
        console.log('Database connected')
    } catch (error) {
        console.log('Error connecting database :(', error)
    }
}

module.exports = {connectDB};
