const express = require('express');
const router = express.Router();
const Axios = require('axios');
require('dotenv').config()

//MODELO
const Notificacion = require('../models/db-notificaciones');

//ENVIAR NOTIFICACIONES
router.post('/enviar', async (req, res, ) => {

    //OBTNER DATA
    const { titulo, cuerpo, dato } = req.body;

    //GUARDAMOS LA NOTIFICACION
    const Notificaciones = new Notificacion({titulo, cuerpo})
    await Notificaciones.save();
    res.status(200)

    //ENVIAMOS A SERVIDOR DE EXPO
    Axios.post("https://exp.host/--/api/v2/push/send",
        data = {
            "to": "ExponentPushToken[WzQgBGN7nYqVBhI15gwXtA]",
            "title": "App Wallet",
            "body": "Tienes un nueva notificación",
            "sound": "default",

            "data": {
                "_displayInForeground": true,
                "data": dato
            }
        }
    )
    res.json('Mensaje enviado')
})

//OBTENER NOTIFICACIONES
router.get('/recibir' , async (req, res,)=> {

    //obtendremos el id de ese usuario y verificaremos si es para el o no
    const Notificaciones = await Notificacion.find();
    //console.log(SkillData);
    res.status(200)
    res.json(Notificaciones)

})

module.exports = router;