const mongoose = require('mongoose');
const {Schema} = mongoose;

//libreria para fechas
const moment = require('moment');

//configuramos el idioma local
moment.locale('es');

const codeSchema = new Schema ({

    //CODIGO DOBLE FACTOR
    correo: {type: String, require: true},
    pin: {type: String, require: true},
    creacion: {type: String, require: true},
    
})
module.exports = mongoose.model('code', codeSchema);
