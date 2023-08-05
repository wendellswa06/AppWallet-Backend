//IMPORTACION DE MODULOS
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');
const helmet = require('helmet');

//IMPORTACION DE RUTAS
const billetera = require('./routes/billetera');
const Notificacion = require('./routes/pushnotificacion');
const Correo = require('./routes/correo');
const Credenciales = require('./routes/credenciales');
const Convertir = require('./routes/convertir');
const Administrador = require('./routes/administrador');

//DEFINICIONES GLOBALES
const app = express();
const log = console.log;
const PORT = process.env.PORT || 3000;

//BASE DE DATOS PRINCIPAL
mongoose.connect(process.env.DB,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, })
    .then(db => console.log('db conectado'))
    .catch(err => console.log(err));

//CONFIGURACION SERVER
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.disable('x-powered-by');
app.use(helmet.xssFilter());

//RUTAS
app.use('/Wallet', billetera);
app.use('/Notificacion', Notificacion);
app.use('/Correo', Correo);
app.use('/Credenciales', Credenciales);
app.use('/Convertir', Convertir);
app.use('/Administrador', Administrador);

//PRODUCION
if (process.env.NODE_ENV === 'production') {

    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // relative path
    });
}

//PUERTO 3000
app.listen(PORT, () => {
    log(`Servidor en el puerto: ${PORT}`);
});