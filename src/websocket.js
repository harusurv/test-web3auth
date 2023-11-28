//import {WEBSOCKET_PORT} from './config.js'
import ws from 'ws';
const wss = new ws.Server({port: 40510})

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
