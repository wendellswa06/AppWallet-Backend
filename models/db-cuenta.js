const mongoose = require('mongoose');
const {Schema} = mongoose;

//libreria para fechas
const moment = require('moment');

//configuramos el idioma local
moment.locale('es');

const cuentaSchema = new Schema ({
    //Auht
    correo: {type: String, require: true},
    auht: {type: Boolean, require: true,},

    creacion: {
        type: String, 
        default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    }  

})
module.exports = mongoose.model('Cuenta', cuentaSchema);
