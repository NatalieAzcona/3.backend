const User = require("../models/User");

const getUsers = async (req, res) => {  //consulta a la bbdd
    try {
        const users = await User.find()     //.find para encontrar
        return res.status(200).json(users);
    } catch (error) {
        return res.status(400).json(error);
    }
}

//getUserbyId

const getUserById = async (req, res) => {
    const {id} = req.params; // necesito sacar el id de la url
try {
    const user = await User.findById(id);
    if (user) {
        return res.status(200).json(user);
    } else {
        return res.status(404).json({message: "no se encontró"})
    }
} catch (error) {
    return res.status(500).json({message: "no se consigue usuario", error})
}
};




module.exports = {getUsers, getUserById}; 