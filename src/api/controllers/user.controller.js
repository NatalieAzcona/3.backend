const User = require("../models/User");
const bcrypt = require('bcrypt')
const { generateToken } = require ('../../utils/token.js') //Revisar si ruta ok

//REGISTER

const registerUser = async(req,res) => {   //Quien tiene permiso de registrar un user? 
    try {
        const {name, email, password, image} = req.body;

        if(!name || !email || !password || !image) {
            return  res.status(400).json({message: "¿y si terminas de escribir lo que te falta? :/" })
        }

        const userExists = await User.findOne({email})
        if (userExists) {
            return res.status(400).json({message: "este email ya está registrado >:("})
        }

        //no le pongo req.body para que no se hagan admin
        const newUser = new User({
            name,
            email,
            password,
            image,
            role: "user"
        });

        const savedUser = await newUser.save();   //aqui llamo al pre save, le cambio el pass

        return res.status(201).json(savedUser);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "error al crear usuario", error
        })
    }
}

//LOGIN 
const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "faltan email o contraseña >:(" });
          }

        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message: "contraseña o usuario incorrecto"})
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "contraseña o usuario incorrecto" });
        }    
        
        const token = generateToken(user._id) //genero token con id
        
        const userWithoutPassword = user.toObject();   // paso a objeto porque Mongo devuelve docu, para poder eliminar la passw
        delete userWithoutPassword.password;

        return res.status(200).json({token, user: userWithoutPassword})
    } catch (error) {
        return res.status(400).json("error en el login")
    }
}


//! Estos necesitan permiso de admin?

//GET
const getUsers = async (req, res) => {  //consulta a la bbdd, esto solo lo puede hacer un admin?
    try {
        const users = await User.find().select("-password")     //.find para encontrar, quitamos pass 
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
    const user = await User.findById(id).select("-password");
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

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const allowedToChange = ['name', 'email', 'image'];
        const updates = {};

        for (const key of allowedToChange) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        } //solo pueden cambiar lo permitido

        const userUpdated = await User.findByIdAndUpdate(
            id, 
            { $set: updates }, // $set cambia valores de lo permitido
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

//DELETE

//el usuario puede borrar su propia cuenta, el admin borra todas, el user no borra otras cuentas

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = req.user; //se comprueba con isAuth

        if(!currentUser) {
            return res.status(401).json({message: "no estás autorizado"})
        }

        const isAdmin = currentUser.role === 'admin';
        const isUser = currentUser._id.toString() === id;

        if (!isAdmin && !isUser) {
            return res.status(403).json({message: "no tienes permiso para eliminar este usuario"})
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({message: "usuario no encontrado"})
        }

        return res.status(200).json({
            message: "Usuario eliminado"
        })
    } catch (error) {
        return res.status(500).json({message: "Error al eliminar usuario", error})
    }
}

// CAMBIO ROL?

const changeRole = async (req, res) => {
    try {
        const currentUser = req.user;
        const {id} = req.params;
        const {role} = req.body;

        if (!currentUser) {
            return res.status(401).json({message: "no estás autorizado"})
        }

        if (currentUser.role !== 'admin') {
            return res.status(403).json({message: "solo un admin puede cambiar el rol :)"})
        }

        const validRoles = ["user", "admin"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "rol no válido" });
        }

        const userToUpdate = await User.findByIdAndUpdate(id, {role});

        if (!userToUpdate) {
            return res.status(404).json({message: "usuario no encontrado"})
        }

        return res.status(200).json({message: "rol actualizado"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "error al cambiar rol", error})
    }
}


module.exports = {registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser, changeRole};