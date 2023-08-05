const express = require('express');
const router = express.Router();
const Axios = require('axios');
require('dotenv').config()

//MODULO NODEMAILER
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

//MODULO CRYPRO
var CryptoJS = require("crypto-js");

//MODELO
const Credenciales = require('../models/db-credenciales');

//Modelo Correo
const Seguridad = require('../email/credenciales')

//ENVIAR CORREO
router.post('/Restaurar', async (req, res, ) => {

    const { correo } = req.body;

    //VALIDAMOS
    if (correo== '' || correo==' ') {
        res.status(300)
        res.json({ status: 'complete el espacio' })
    }

    const query = { correo: correo };
    const data = await Credenciales.findOne(query);

    //VALIDAMOS
    if (!data) {
        res.status(500)
        res.json({ status: 'Este Correo No Existe' })
    }

    //JSON CONTRASEÑA
    const contraseña = data.contraseña

    //DESCRIPTAR
    var byte = CryptoJS.AES.decrypt(contraseña, process.env.KEY_WALLET);
    var texto = byte.toString(CryptoJS.enc.Utf8);

    //ENVIAMOS CREDENCIALES USUARIO
    Seguridad(correo, texto)
    
    res.status(200)
    res.json({ mensaje: 'Credenciales Restaurado' })

})

module.exports = router;