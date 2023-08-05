//DB
const Code = require('../models/db-code');

//MODELOS DE CORREO
const Codigo = require('../email/codigo');

//NUMERO RANDOM
const number = require('randomatic');

//libreria para fechas
const moment = require('moment');

//configuramos el idioma local
moment.locale('es');

async function pin(email, res) {

    const code = number('0', 6);
    const actual = moment().format("dddd, MMMM Do YYYY, h:mm:ss a")

    //Verificamos email
    const buscar = await Code.findOne({ correo: email });

    if (!buscar) {

        //Guardamos Correo Y Pin
        const codigo = new Code({ correo: email, pin: code, creacion:  actual})
        codigo.save()

        //Enviamos Codigo
        Codigo(email, code)

    }
    else {

        //Renovamos el pin
        await buscar.updateOne({
            pin: code, 
            creacion:  actual
        }, { status: 200 }, { upsert: true });

        //Enviamos Codigo
        Codigo(email, code)

    }   
}

module.exports = pin;

