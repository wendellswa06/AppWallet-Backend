require('dotenv').config()

//MODULO NODEMAILER
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

function nuevocliente(correo, codigo) {

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
        subject: 'Codigo Seguridad  🔑'+ '  ',
        html: '<h1>Codigo Seguridad</h1>'+ '<h1>' + codigo +'</h1><br></br>' + '<p></p>' + '<p><i>Este Codigo Expirara En 5 Minutos</i></p>' + '<p><b>Equipo App Wallet</b></p>'+'<a href="https://www.app-wallet.net/" style="text-decoration:none">Visita Nuestra Web!</a>'

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