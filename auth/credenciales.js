//DB
const Credenciales = require('../models/db-credenciales');

async function credenciales(email, contraseña) {

    //Verificamos email
    const buscar = await Credenciales.findOne({ correo: email });

    if (!buscar) {
           //ANEXAMOS A MONGODB
           const Segurity = new Credenciales({ correo: email, contraseña: contraseña })

           //GUARDAMOS CREDENCIALES
           Segurity.save()
    }
    else {

        //Renovamos si existe ese correo ya.
        await buscar.updateOne({
            correo: email, 
            contraseña:  contraseña
        }, { status: 200 }, { upsert: true });

    }   
}

module.exports = credenciales;

