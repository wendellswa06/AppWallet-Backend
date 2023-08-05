const mongoose = require('mongoose');
const {Schema} = mongoose;

//libreria para fechas
const moment = require('moment');

//configuramos el idioma local
moment.locale('es');

const NotificacionesSchema = new Schema ({

    //NOTIFICACIONES
    titulo: {type: String, require: true},
    cuerpo: {type: String, require: true},
    user: {type: String, require: true},
    
    creacion: {
        type: String, 
        default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    }
    
})

module.exports = mongoose.model('Notificaciones', NotificacionesSchema);
