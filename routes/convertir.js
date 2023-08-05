const express = require('express');
const router = express.Router();
const Axios = require('axios');
require('dotenv').config()

//BTC A USD
router.post('/BTC-USD', async (req, res, ) => {

    //OBTNER DATA
    const { balance } = req.body;
    Axios.get(`https://web-api.coinmarketcap.com/v1/tools/price-conversion?amount=${balance}&convert_id=2781&id=1`,
    )
        .then(Response => fetch(Response.data.data.quote["2781"]))
        .catch(err => {
            res.status(500)
            res.json({ status: 'error' });
        });
    async function fetch(data) {
        const USD = data
        res.json(USD);
    }
})

//USD A BTC
router.post('/USD-BTC', async (req, res, ) => {

    //OBTNER DATA
    const { balance } = req.body;
    Axios.get(`https://web-api.coinmarketcap.com/v1/tools/price-conversion?amount=${balance}&convert_id=1&id=2781`,
    )
        .then(Response => fetch(Response.data.data.quote[1]))
        .catch(err => {
            res.status(500)
            res.json({ status: 'error' });
        });
    async function fetch(data) {
        const BTC = data
        res.json(BTC);
    }
})

//COP A BTC
router.post('/COP-BTC', async (req, res, ) => {

    //OBTNER DATA
    const { balance } = req.body;
    Axios.get(`https://web-api.coinmarketcap.com/v1/tools/price-conversion?amount=${balance}&convert_id=1&id=2820`,
    )
        .then(Response => fetch(Response.data.data.quote[1]))
        .catch(err => {
            res.status(500)
            res.json({ status: 'error' });
        });
    async function fetch(data) {
        const BTC = data
        res.json(BTC);
    }
})


//BTC A COP
router.post('/BTC-COP', async (req, res, ) => {

    //OBTNER DATA
    const { balance } = req.body;
    Axios.get(`https://web-api.coinmarketcap.com/v1/tools/price-conversion?amount=${balance}&convert_id=2820&id=1`,
    )
        .then(Response => fetch(Response.data.data.quote['2820']))
        .catch(err => {
            res.status(500)
            res.json({ status: 'error' });
        });
    async function fetch(data) {
        const COP = data
        res.json(COP);
    }
})


module.exports = router;