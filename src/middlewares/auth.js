function authenticateMiddleware (req, res, next) {
    if (!req.user) {
        return res.status(401).json({message: "no puedes entrar :)"});
    }
    next();
}
module.exports = authenticateMiddleware;

// Esto tengo que ajustarlo a mi código