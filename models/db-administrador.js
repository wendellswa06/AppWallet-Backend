const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

//libreria para fechas
const moment = require('moment');

//configuramos el idioma local
moment.locale('es');

const AdministradorSchema = new Schema ({

    //Administrador
    id: {type: String, require: true},
    pin: {type: String, require: true},

    creacion: {
        type: String, 
        default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    }
})

AdministradorSchema.methods.encriparcontraseña = async (pin) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(pin, salt);
};

AdministradorSchema.methods.validarcontraseña = function (pin) {
    return bcrypt.compare(pin, this.pin);
};

module.exports = mongoose.model('ceo-administrador', AdministradorSchema);
