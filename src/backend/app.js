const cors = require('cors')
const axios = require('axios')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const {
    register,
    login,
    getBalancingAuthority,
    getRealTimeEmissionIndex,
    getGridEmissionData,
    getEmissionForecast,
    getHistorical
} = require('./api/index.js')

app.set('PORT', 5500)

app.use(cors({
    origin: '*'
}))

// parse application/json
app.use(bodyParser.json())

app.post('/bullshit',(req,res)=>{
    res.send('bullshit')
})

app.post('/signup', async (req, res) => {

    const credentials = req.body

    register(credentials).then((response) => {
        res.json(response.data)
    }, (err) => {
        res.json({ err })
    })

})

app.post('/login', async (req, res) => {

    const credentials = req.body

    login(credentials).then((response) => {
        res.json(response.data)
    }, (err) => {
        res.json({ err })
    })

})

app.post('/balancing-authority', async (req, res) => {

    const { lag, long, token } = req.body

    getBalancingAuthority(lag, long, token).then((response) => {
        res.json(response.data)
    }, (err) => {
        res.json({ err })
    })

})

app.post('/real-time-emission-index', async (req, res) => {

    const { ba, lag = null, long = null, token } = req.body

    getRealTimeEmissionIndex({ ba, lag, long, token }).then((response) => {
        res.json(response.data)
    }, (err) => {
        res.json({ err })
    })

})


app.post('/real-time-emission-index', async (req, res) => {

    const { ba, lag = null, long = null, token } = req.body

    getRealTimeEmissionIndex({ ba, lag, long, token }).then((response) => {
        res.json(response.data)
    }, (err) => {
        res.json({ err })
    })

})

app.post('/grid-emission-data', async (req, res) => {

    const { ba, lag = null, long = null, token } = req.body

    getGridEmissionData({ ba, lag, long, token }).then((response) => {
        res.json(response.data)
    }, (err) => {
        res.json({ err })
    })

})

app.post('/emission-forecast', async (req, res) => {

    const { ba, starttime,endtime, token } = req.body

    getEmissionForecast({ ba,starttime,endtime, token }).then((response) => {
        res.json(response.data)
    }, (err) => {
        res.json({ err })
    })

})

app.post('/historical-emission', async (req, res) => {

    const { ba, token } = req.body

    getHistorical({ ba, token }).then((response) => {
        res.json(response.data)
    }, (err) => {
        res.json({ err })
    })

})

app.listen(app.get('PORT'), () => {
    console.log(`Listen on port ${app.post('PORT')}`)
})