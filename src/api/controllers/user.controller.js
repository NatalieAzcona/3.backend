const User = require("../models/User");

const getUsers = async (req, res) => {  //consulta a la bbdd
    try {
        const users = await User.find()     //.find para encontrar
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
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
    console.log(error);
    return res.status(500).json({message: "no se consigue usuario", error})
}
};

const createUser = async(req,res) => {
    try {
        const newUser = new User(req.body);
        newUser.role = "user";
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "error al crear usuario", error
        })
    }
}
//Este updateUser no me sirve cuando hago la prueba en Insomnia
/* const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const newUser = new User(req.body);
        newUser._id = id;
        const userUpdated = await User.findByIdAndDelete(id, newUser, {
            new: true, 
        })
        return res.status(200).json(userUpdated)
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "error actualizando usuario", error
        })
    }
}*/ 

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const userUpdated = await User.findByIdAndUpdate(
            id, 
            { $set: req.body }, // $set cambia valores
            { new: true, runValidators: true} //me devuelve lo actualziado y según schema
        );
        if (!userUpdated) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        return res.status(200).json(userUpdated);
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            message: "user can't be updated",
            error
        })
    }
}

//PENDIENTE MIDDLEWARE PARA AUTORIZAR QUIÉN PUEDE ELIMINAR

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Usuario eliminado"
        })
    } catch (error) {
        return res.status(500).json({message: "Error al eliminar usuario", error})
    }
}

// CAMBIO ROL NECESITA MIDDLEWARE ESTÄ INCOMPLETO

/*
const changeRole = async (req, res) => {
    try {
        const {id} = req.params;
        const {role} = req.body;


    } catch () {
        
    }
}
*/

module.exports = {getUsers, getUserById, createUser, updateUser, deleteUser}; 