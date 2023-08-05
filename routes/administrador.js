const express = require('express');
const router = express.Router();
require('dotenv').config()

//MODELO
const Administrador = require('../models/db-administrador');
const Usuarios = require('../models/db-billetera');
const Cuenta = require('../models/db-cuenta');
const Cambios = require('../models/db-cambio');

//REGISTRAR CREDENCIALES
router.post('/registrar', async (req, res,) => {
    const { id, pin } = req.body;

    //VALIDAMOS CAMPOS
    if (id == " " || pin == " " || id == "" || pin == "") {
        res.status(400)
        res.json({ mensaje: 'Complete los campos' })
    }

    //ID
    const query1 = { id: id };
    const dataid = await Administrador.findOne(query1);

    //PIN
    const query2 = { pin: pin };
    const datapin = await Administrador.findOne(query2);

    //VALIDAMOS DATOS EXISTENTES
    if (dataid || datapin) {
        res.status(306)
        res.json({ Mensaje: 'Datos Ya Existen' })
    }
    else {
        
        //ANEXAMOS A MONGODB
        const Admin = new Administrador({ id, pin })

        //ENCRIPTAMOS CONTRASEÑA
        Admin.pin = await Admin.encriparcontraseña(Admin.pin);

        //Guardamos
        Admin.save()

        //ENVIAMOS EL ESTADO Y RESPUESTA DE LA PETICION
        res.status(200)
        res.json({ mensaje: 'Credenciales Creada' })
    }
})

//CREDENCIALES LOGIN 
router.post('/login', async (req, res,) => {

    const { id, pin } = req.body;

    const data_id = await Administrador.findOne({ id: id });
    if (!data_id) {
        res.status(404)
        res.json({ status: 'este id no existe' });
    }

    const data_pin = await data_id.validarcontraseña(pin)
    if (!data_pin) {
        res.status(404)
        res.json({ status: 'pin incorrecta' });
    }

    else {
        res.status(200)
        res.json({ status: 'Bienvenido' });
    }
})

//CREDENCIALES LOGIN 
router.post('/Usuarios', async (req, res,) => {

    //DATA COMPLETA
    const data = await Usuarios.find({}, {
        nombre: 1,
        apellido: 1,
        celular: 1,
        _id: 1,
        identificacion: 1,
        tipo: 1,
        pais: 1,
        ciudad: 1,
        celular: 1,
        correo: 1,
        wallet: 1,
        creacion: 1,
        nacimiento: 1,
    })

    const resultado = {datos: data , cantidad: data.length}
    res.status(200)
    res.json(resultado);

})

//Cambbios Solicitados
router.post('/Cambios', async (req, res,) => {
    //Cambios Solicitados
    const data = await Cambios.find({}, {
        _id: 0,
        __v: 0,
    })
    //Respuesta
    res.status(200)
    res.json(data);
})

//CREDENCIALES LOGIN 
router.post('/Cuenta', async (req, res,) => {

    //Obtenemos Datos
    const { correo } = req.body;

    //CUENTAS
    const query1 = { correo: correo }
    const cuenta = await Cuenta.find(query1, {
        _id: 0,
        auht: 1,
    })

    if(Object.keys(cuenta).length === 0){ 
        res.status(400)
        res.json({mensaje: 'Correo Incorrecto'});
    }
    else{    
        cuenta.forEach(element => res.json(element['auht']));
    }
})

module.exports = router;