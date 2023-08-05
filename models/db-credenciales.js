const mongoose = require('mongoose');
const {Schema} = mongoose;

//libreria para fechas
const moment = require('moment');

//configuramos el idioma local
moment.locale('es');

const CredencialesSchema = new Schema ({

    //CREDENCIALES
    correo: {type: String, require: true},
    contraseña: {type: String, require: true},

    creacion: {
        type: String, 
        default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    }
})
module.exports = mongoose.model('Credenciales', CredencialesSchema);
