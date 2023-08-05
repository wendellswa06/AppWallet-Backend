const mongoose = require('mongoose');
const {Schema} = mongoose;

//libreria para fechas
const moment = require('moment');

//configuramos el idioma local
moment.locale('es');

const CambioSchema = new Schema ({

    //CAMBIO BTC A COP
    identificacion: {type: String, require: true},
    nombre: {type: String, require: true},
    apellido: {type: String, require: true},
    cantidadbtc: {type: Number, require: true},
    numerobancario: {type: Number, require: true},
    tipocuenta: {type: String, require: true},
    banco: {type: String, require: true},
    realizado: {type: Boolean, require: true},
    
    creacion: {
        type: String, 
        default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    }
})

module.exports = mongoose.model('Cambios', CambioSchema);
