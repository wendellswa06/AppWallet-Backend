const express = require('express');
const router = express.Router();
const Axios = require('axios');
require('dotenv').config()

//MODULO CRYPRO
var CryptoJS = require("crypto-js");

//MODELO
const Credenciales = require('../models/db-credenciales');

//CREDENCIALES
router.post('/App', async (req, res, ) => {

    const { correo, contraseña } = req.body;

    //ENCRIPTAMOS
    const datacontraseña = CryptoJS.AES.encrypt(contraseña, process.env.KEY_WALLET).toString();

    //ANEXAMOS A MONGODB
    const Data = new Credenciales({ correo, contraseña: datacontraseña })

    //GUARDAMOS
    Data.save()

    res.json({ status: 'Credenciales Guardadas' }); 

})

//DESCRITPAR
router.post('/open', async (req, res, ) => {

    const { correo } = req.body;

    const query = { correo: correo };
    const data = await Credenciales.findOne(query);

    //VALIDAMOS
    if (!data) {
        res.status(500)
        res.json({ status: 'Estos datos no existen' })
    }

    //JSON CONTRASEÑA
    const contraseña = data.contraseña

    //DESCRIPTAR
    var byte = CryptoJS.AES.decrypt(contraseña, process.env.pass);
    var texto = byte.toString(CryptoJS.enc.Utf8);

    //RESPUESTA
    res.json(texto);

})

module.exports = router;