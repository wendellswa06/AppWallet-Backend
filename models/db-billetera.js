const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

//libreria para fechas
const moment = require('moment');

//configuramos el idioma local
moment.locale('es');

const BilleteraSchema = new Schema ({

    //CREACION WALLET
    nombre: {type: String, require: true},
    apellido: {type: String, require: true},
    tipo: {type: String, require: true},
    identificacion: {type: Number, require: true},
    nacimiento: {type: String, require: true},
    pais: {type: String, require: true},
    ciudad: {type: String, require: true},
    celular: {type: Number, require: true},

    //AUTH  Y WALLET 
    correo: {type: String, require: true},
    contraseña: {type: String, require: true},
    condicion: {type: Boolean, require: true},

    //WALLET
    wallet: {type: String, require: true},
    pin: {type: String, require: true},
    
    creacion: {
        type: String, 
        default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    }
    
})

BilleteraSchema.methods.encriparcontraseña = async (contraseña) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(contraseña, salt);
};

BilleteraSchema.methods.validarcontraseña = function (contraseña) {
    return bcrypt.compare(contraseña, this.contraseña);
};


module.exports = mongoose.model('billetera', BilleteraSchema);
