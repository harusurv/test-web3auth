//import {WEBSOCKET_PORT} from './config.js'

console.log("START WEBSOCKET")
var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({port: 40510})

wss.on('connection', function (ws) {
  console.log("connection")
  ws.on('message', function (message) {
    console.log('received: %s', message)
  })

  setInterval(
    () => ws.send(`${new Date()}`),
    1000
  )
})
