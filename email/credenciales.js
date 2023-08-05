require('dotenv').config()

//MODULO NODEMAILER
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

function credenciales(correo, contraseña) {

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
        subject: 'Olvidastes tu contraseña? 🔑',
        html: '<h1>Credenciales</h1><p><b>Correo: </b>' + correo + '<p><b>Contraseña: </b>' + contraseña + '<br></br>' + '<p><b>Equipo App Wallet</b></p>'+'<a href="https://www.app-wallet.net/" style="text-decoration:none">Visita Nuestra Web!</a>'

    };

    //TRANSFERENCIA DE CORREO
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log('error al verificar o enviar correo')
        }
        return console.log('mensaje enviado')

    });
}

module.exports = credenciales;