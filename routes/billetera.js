const express = require('express');
const router = express.Router();
const Axios = require('axios');
require('dotenv').config()

//MODULO CRYPR
var CryptoJS = require("crypto-js");

//MODELO
const Billetera = require('../models/db-billetera');
const Code = require('../models/db-code');
const Credenciales = require('../models/db-credenciales');
const Cuenta = require('../models/db-cuenta');
const Cambios = require('../models/db-cambio');

//SEGURIDAD Y AUHTENTIFICACION
const jwt = require('jsonwebtoken')

//VERIFICAR TOKEN
const VerificarToken = require('../token/verificartoken')

//AUTH
const GenerarPin = require('../auth/pin.js')
const CREDENCIALES_SAVE = require('../auth/credenciales')

//SECRET
const Config = require('../token/config');

//MODELOS DE CORREO
const Nuevo = require('../email/nuevo');

//CREAR WALLET
router.post('/Crear', async (req, res) => {

    //OBTNER DATA
    const { nombre, apellido, tipo, identificacion, nacimiento, pais, ciudad, celular, correo, contraseña, condicion, pin } = req.body;

    //VALIDAMOS CAMPOS
    if (nombre == "" || apellido == "" || tipo == "" || identificacion == "" || nacimiento == "" || pais == "" || ciudad == "" || celular == "" || correo == "" || contraseña == "" || condicion == false || pin == "") {
        res.status(408)
        res.json({ mensaje: 'Complete los campos' })
    }

    if (nombre == " " || apellido == " " || tipo == " " || identificacion == " " || nacimiento == " " || pais == " " || ciudad == " " || celular == " " || correo == " " || contraseña == " " || condicion == false || pin == " ") {
        res.status(408)
        res.json({ mensaje: 'Complete los campos' })
    }

    //CORREO
    const query1 = { correo: correo };
    const datacorreo = await Billetera.findOne(query1);

    //IDENTIFICACION
    const query2 = { identificacion: identificacion };
    const dataidentificacion = await Billetera.findOne(query2);

    //CELULAR
    const query3 = { celular: celular };
    const datacelular = await Billetera.findOne(query3);

    //VALIDAMOS DATOS EXISTENTES
    if (datacorreo || dataidentificacion || datacelular) {
        res.status(306)
        res.json({ Mensaje: 'Correo o identificacion o telefono ya existen' })
    }
    else {

        //OBTENER TOKEN JWT
        const user = {
            usuario: process.env.USUARIO,
            pass: process.env.PASS
        }
        const token = jwt.sign({ acesso: user }, Config.secret, {
            expiresIn: '8m'
        })

        //CREAR BILLETERA EN BITCOIN
        //PARAMETROS
        const headers = {
            pin: process.env.PIN,
            servicio: process.env.SERVICIO,
            autorizacion: 'barer ' + token
        }

        const data = {
            id: identificacion,
            contraseña: contraseña
        }

        //CREAR BILLETERA EN BITCOIN
        Axios.post('http://159.89.224.113:5000/Wallet/Crear', data, {
            headers: headers
        })
            .then(terminar())
            .catch(err => {
                if (res.status(400)) {
                    res.json({ mensaje: 'Esta Billetera Ya Existe EN Bitcoin' });
                }
                else {
                    res.json(err);
                }
            });

        function terminar() {
            setTimeout(function generardirecion() {
                //GENERAR DIRECION BITCOIN
                const data2 = {
                    id: identificacion
                }

                Axios.post('http://159.89.224.113:5000/Wallet/Generar', data2, {
                    headers: headers
                })
                    .then(Response => wallet(Response.data))

                async function wallet(btc) {

                    //DIRECION BTC
                    const wallet = btc.receiveAddress

                    //ANEXAMOS A MONGODB
                    const Wallet = new Billetera({ nombre, apellido, tipo, identificacion, nacimiento, pais, ciudad, celular, correo, contraseña, condicion, wallet, pin })

                    //ENCRIPTAMOS CONTRASEÑA
                    Wallet.contraseña = await Wallet.encriparcontraseña(Wallet.contraseña);

                    //Guardamos
                    Wallet.save()

                    //Encriptamos contraseña
                    const datacontraseña = CryptoJS.AES.encrypt(contraseña, process.env.KEY_WALLET).toString();

                    //Guardamos Credenciales
                    CREDENCIALES_SAVE(correo, datacontraseña)

                    //Enviamos correo de bienvenida
                    Nuevo(correo, nombre, apellido)

                    //ENVIAMOS EL ESTADO Y RESPUESTA DE LA PETICION
                    res.status(200)
                    res.json({ mensaje: 'Wallet Creada' })
                }
            }, 1000);
        }
    }
})

//INGRESAR A WALLET
router.post('/Login', async (req, res,) => {

    //DATA
    const { correo, contraseña } = req.body;

    const usuario = await Billetera.findOne({ correo: correo });

    if (!usuario) {
        res.status(404)
        res.json({ status: 'no existe este usuario' });
    }
    const contraseñavalida = await usuario.validarcontraseña(contraseña)

    if (!contraseñavalida) {
        res.status(404)
        res.json({ status: 'Contraseña incorrecta' });
    }

    //VERIFICAR SI LA CUENTA SE ESTA UTILIZANDO
    const cuenta_auht = await Cuenta.findOne({ correo: correo, auht: true });

    if (cuenta_auht) {
        res.status(500)
        res.json({ status: 'Esta Cuenta esta En uso no tienes permisos.' });
    }

    else {
        //RESULTADO
        const data = await Billetera.findById(usuario._id,
            {
                _id: 0,
                contraseña: 0,
                __v: 0,
                creacion: 0,
                condicion: 0,
            })
        GenerarPin(correo, res)
        res.json(data)
    }
})

//BALANCE WALLET
router.post('/Balance', async (req, res,) => {

    //OBTNER DATA
    const { id } = req.body;

    //OBTENER TOKEN JWT
    const user = {
        usuario: process.env.USUARIO,
        pass: process.env.PASS
    }
    const token = jwt.sign({ acesso: user }, Config.secret, {
        expiresIn: '8m'
    })

    //PARAMETROS
    const headers = {
        pin: process.env.PIN,
        servicio: process.env.SERVICIO,
        autorizacion: 'barer ' + token
    }

    const data = {
        "id": id,
    }

    //PETICION HTTP BITCOIN
    Axios.post('http://159.89.224.113:5000/Wallet/Balance', data, {
        headers: headers
    })

        .then(Response => fetch(Response.data))
        .catch(err => {
            if (res.status(403)) {
                res.json({ status: 'ACCESO DENEGADO O ERROR' });
            }
            else {
                res.json(err);
            }

        });

    async function fetch(data) {

        //OBTENEMOS BALANCE
        const valor = data.confirmed

        //CONVERTIMOS LOS SATOSHIS A BITCOIN
        const BTC = valor / 100000000

        //ENVIAMOS EL ESTADO Y RESPUESTA DE LA PETICION
        res.status(200)
        res.json({ BTC });
    }
})


//ENVIAR
router.post('/Enviar', async (req, res,) => {

    //OBTNER DATA
    const { guid, origen, destino, monto, contraseña } = req.body;

    const COMISION = monto * process.env.COMISION_BLOCKHAIN / 100
    const COMISION_BYTE = monto * process.env.COMISIONES_BYTES / 100

    if (monto < 400) {
        res.status(400)
        res.json({ status: 'Tu Monto debe ser mayor de 400 satoshis' });
    }

    else Axios.post(`http://159.89.224.113:5000/merchant/${guid}/payment`,
        data = {
            "password": contraseña,
            "api_code": process.env.BLOCKHAIN_CODE,
            "amount": monto,
            "from": origen,
            "to": destino,
            "fee": COMISION,
        }
    )
        .then(Response => fetch(Response.data))
        .catch(err => {
            res.status(500)
            res.json({ status: 'Error' + err });
        });

    async function fetch(data) {

        //ENVIAMOS EL ESTADO Y RESPUESTA DE LA PETICION
        res.status(200)
        res.json({ status: 'Envio exitoso' });
    }
})

//TRANSFERENCIAS API
router.post('/Transferencias', async (req, res,) => {

    //OBTNER DATA
    const { id } = req.body;

    //OBTENER TOKEN JWT
    const user = {
        usuario: process.env.USUARIO,
        pass: process.env.PASS
    }
    const token = jwt.sign({ acesso: user }, Config.secret, {
        expiresIn: '8m'
    })

    //PARAMETROS
    const headers = {
        pin: process.env.PIN,
        servicio: process.env.SERVICIO,
        autorizacion: 'barer ' + token
    }

    const data = {
        "id": id,
    }

    //PETICION HTTP BITCOIN
    Axios.post('http://159.89.224.113:5000/Wallet/Transferencias', data, {
        headers: headers
    })
        .then(Response => trasnferencias(Response.data))

    async function trasnferencias(data) {
        res.status(200)
        res.json(data);
    }
})

//PRUEBA
router.post('/Token', async (req, res,) => {

    //usuario para las peticiones
    const user = {
        usuario: process.env.USUARIO,
        pass: process.env.PASS
    }
    const token = jwt.sign({ acesso: user }, Config.secret, {
        expiresIn: '8m'
    })

    //guarda el token
    res.json(token)
})


//AUTENTIFICACION
router.post('/Autentificacion', async (req, res,) => {

    //OBTENER DATA
    const { correo } = req.body;

    //BUSQUEDA
    const buscar = await Code.findOne({ correo: correo });

    if (!buscar) {
        res.status(404)
        res.json({ mensaje: 'no existe el correo' })
    }
    else {
        res.json(buscar)
        res.status(200)
    }

})

//CUENTA
router.post('/Cuenta', async (req, res,) => {

    //OBTENER DATA
    const { correo, auht } = req.body;

    //Verificamos email
    const buscar = await Cuenta.findOne({ correo: correo });

    if (!buscar) {
        //Guardamos autentificacion de la cuenta
        const cuenta = new Cuenta({ correo: email, auht: auht })
        cuenta.save()
        res.status(200)
    }
    else {
        //Renovamos si existe ese correo ya.
        await buscar.updateOne({
            correo: email,
            auht: auht
        }, { status: 200 }, { upsert: true });
        res.status(200)
    }
})

//CUENTA
router.post('/Prueba', async (req, res,) => {

    //OBTENER DATA
    const { comision } = req.body;

    function calcularcomision(data) {
        // 1.500.000 satoshis = 200 usd 2020
        if (data <= 1500000) {
            return 30000
        }
        //mayor de 200 usd = 3%
        if (data > 1500000) {
            return data * process.env.COMISION_CEO / 100
        }
    }
    res.json({ comision: calcularcomision(comision) })

})

//CUENTA
router.post('/Cambios', async (req, res,) => {

    //OBTENER DATA
    const { identificacion, nombre, apellido, cantidadbtc, numerobancario, tipocuenta, banco } = req.body;

    //Cambio realizado
    let realizado = false

    //VALIDAMOS CAMPOS
    if (identificacion == "" || nombre == "" || apellido == "" || cantidadbtc == "" || numerobancario == "" || tipocuenta == "" || banco == "") {
        res.status(408)
        res.json({ mensaje: 'Complete los campos' })
    }

    if (identificacion == " " || nombre == " " || apellido == " " || cantidadbtc == " " || numerobancario == " " || tipocuenta == " " || banco == " ") {
        res.status(408)
        res.json({ mensaje: 'Complete los campos' })
    }
    else {
        //ANEXAMOS A MONGODB
        const cambio = new Cambios({
            identificacion,
            nombre,
            apellido,
            cantidadbtc,
            numerobancario,
            tipocuenta,
            banco,
            realizado
        });
        //Guardamos
        cambio.save()

        //Respueta 200 OK
        res.status(200)
        res.json({ mensaje: 'Cambio Guardado' })
    }
})
module.exports = router;