require('dotenv').config()

//MODULO NODEMAILER
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

function nuevocliente(correo, nombre, apellido) {

    //FORMATO
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    //CONFIGURACION DE PUERTO
    let transporter = nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        //secure: true,
        auth: {
            user: process.env.user,
            pass: process.env.pass
        }
    }));

    //INFORMACION DE CORREO
    let mailOptions = {
        from: 'appwallet.info@gmail.com',
        to: correo,
        subject: 'Felicidades!! 💳   💸      ',
        html: '<h1>Bienvenido </h1>'+ '<h2>' + nombre.capitalize() +' '+ apellido.capitalize() +'</h2><br></br>' + '<p>Es un gusto tenerte con nosotros, con app wallet puedes recibir y enviar tus bitcoin.</p>' + '<p><i>proximamente podras cambiar tus bitcoin a pesos colombianos</i></p>' + '<p><b>Equipo App Wallet</b></p>'+'<a href="https://www.app-wallet.net/" style="text-decoration:none">Visita Nuestra Web!</a>'

    };

    //TRANSFERENCIA DE CORREO
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log('error al verificar o enviar correo')
        }
        return console.log('mensaje enviado')
    });
}

module.exports = nuevocliente;