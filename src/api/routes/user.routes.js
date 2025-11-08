const express = require("express");
const {getUsers} = require("../controllers/user.controller")


//Creo mi ruta
const router = express.Router();

router.get("/", getUsers);

module.exports = router;