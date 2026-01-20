const User = require("../models/User");
const Task = require("../models/Task");
const bcrypt = require('bcrypt')
const { generateToken } = require ('../../utils/token.js') 
const { deleteImgCloudinary } = require('../../utils/deleteImgCloudinary');


const registerUser = async(req,res) => {  
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return  res.status(400).json({message: "Faltan datos por rellenar" })
        }

        if(!req.file) {
            return res.status(400).json({message: "La imagen es obligatoria"})
        }
        
        const userExists = await User.findOne({email})
        if (userExists) {
            return res.status(400).json({message: "Este email ya está registrado"})
        }

        //no le pongo req.body para que no se hagan admin
        const newUser = new User({
            name,
            email,
            password,
            image: req.file.path, //aquí guardo la ruta
            role: "user"
        });

        const savedUser = await newUser.save();   //aqui llamo al pre save

        return res.status(201).json(savedUser);
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear usuario"
        })
    }
}

const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Falta email o contraseña" });
          }

        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message: "Usuario no encontrado"})
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Credenciales incorrectas" });
        }    
        
        const token = generateToken(user._id) //genero token con id
        
        const userWithoutPassword = user.toObject();   // paso a objeto porque Mongo devuelve docu, para poder eliminar la passw
        delete userWithoutPassword.password;

        return res.status(200).json({token, user: userWithoutPassword})
    } catch (error) {
        return res.status(500).json("Error en el login")
    }
}

const getUsers = async (req, res) => {  
    try {
        const users = await User.find().select("-password")     //.find para encontrar, quitamos pass 
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "error al obtener usuarios"});
    }
}

const getUserById = async (req, res) => {
    const {id} = req.params; 
try {
    const user = await User.findById(id).select("-password");
    if (user) {
        return res.status(200).json(user);
    } else {
        return res.status(404).json({message: "No se encontró ususario"})
    }
} catch (error) {
    return res.status(500).json({message: "No se consigue usuario"})
}
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = req.user; 

        const isAdmin = currentUser.role === 'admin';
        const isUser = currentUser._id.toString() === id;

        if (!isAdmin && !isUser) {
            return res.status(403).json({message: "no tienes permiso para actualizar este usuario"})    
        }

        //buscar usuario y su imagen
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({message: "usuario no encontrado"})     
        }

        const allowedToChange = ['name', 'email'];
        const updates = {};

        for (const key of allowedToChange) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        } //solo pueden cambiar lo permitido

        //si hay nueva imagen, borro la antigua
        if (req.file) {
            if (user.image) {
                deleteImgCloudinary(user.image);
            }
            updates.image = req.file.path;
        }
        //actualizo en bbdd
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
        return res.status(400).json({ message: "No se puede actualizar el usuario" })
    }
}

//el usuario puede borrar su propia cuenta, el admin borra todas, el user no borra otras cuentas

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = req.user; 

        if(!currentUser) {
            return res.status(401).json({message: "No estás autorizado"})
        }

        const isAdmin = currentUser.role === 'admin';
        const isUser = currentUser._id.toString() === id;

        if (!isAdmin && !isUser) {
            return res.status(403).json({message: "No tienes permiso para eliminar a este usuario"})
        }

        const userToDelete = await User.findById(id);
        if(!userToDelete) {
            return res.status(404).json({ message: "Usuario no encontrado"})
        }

        await Task.deleteMany({user: userToDelete._id})

        if (userToDelete.image) {
            try {
                deleteImgCloudinary(userToDelete.image)
            } catch (error) {
                return res.status(500).json({ message: "Error al eliminar la imagen de usuario" })
            }
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({message: "Usuario no encontrado"})
        }

        return res.status(200).json({
            message: "Usuario y tareas eliminadas"
        })
    } catch (error) {
        return res.status(500).json({message: "Error al eliminar usuario" })
    }
}

const changeRole = async (req, res) => {
    try {
        const currentUser = req.user;
        const {id} = req.params;
        const {role} = req.body;

        if (!currentUser) {
            return res.status(401).json({message: "No estás autorizado"})
        }

        if (currentUser.role !== 'admin') {
            return res.status(403).json({message: "Solo un admin puede cambiar el rol"})
        }

        const validRoles = ["user", "admin"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Rol no válido" });
        }

        const userToUpdate = await User.findByIdAndUpdate(id, {role});

        if (!userToUpdate) {
            return res.status(404).json({message: "Usuario no encontrado"})
        }

        return res.status(200).json({message: "Rol actualizado"})

    } catch (error) {;
        return res.status(500).json({message: "Error al cambiar rol"})
    }
}


module.exports = {registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser, changeRole};