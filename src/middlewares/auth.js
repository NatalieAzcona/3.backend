const User = require('../api/models/User')
const { verifyJwt } = require('../utils/token')


//Revisamos si el user tiene el token

const isAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '') //el replace es solo para eliminar el bearer
  if(!token) return res.status(401).json("Unauthorized")
  try {
  const decoded = verifyJwt(token)
  req.user = await User.findById(decoded.id)  
  next()  
  } catch (error) {
      return res.status(401).json("Unauthorized")
    }


}

const isAdmin = (req, res, next) => { 
   if (req.user.role !== 'admin') {       
      return res.status(403).json({message: "solo un admin puede hacer esto :)"})
   }
    next()
}


module.exports = {isAuth, isAdmin};
