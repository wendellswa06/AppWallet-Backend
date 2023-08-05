//VARIABLE DE ENTORNO
require('dotenv').config()

function VerificarToken(req, res, next) {
    
    const cabecera = req.headers['autorizacion']
    const servicio = req.headers['servicio']
    const pin = req.headers['pin']

    if (typeof cabecera !== 'undefined' && servicio == process.env.SERVICIO && pin == process.env.PIN ) {
        const tokenportador = cabecera.split(' ')[1]
        req.token = tokenportador
        next()
    }
    else {
        res.sendStatus(403) //forbidden
    }
}
module.exports = VerificarToken;