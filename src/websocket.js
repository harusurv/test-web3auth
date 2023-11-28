const { createServer } = require('https');
const { readFileSync } = require('fs');
var WebSocketServer = require('ws').Server
const server = createServer({
  key: readFileSync("/etc/letsencrypt/live/clickfarm.ddns.net/privkey.pem"),
  cert: readFileSync("/etc/letsencrypt/live/clickfarm.ddns.net/cert.pem")
});
wss = new WebSocketServer({server ,port: 40510})

const channels = {}
wss.on('connection', function (ws) {
  ws.on('message', async function(message) {
    const data = JSON.parse(message)
    if(data.type == "subscribe"){
      channels[data.channel] = ws
      setTimeout(()=>{
        delete channels[data.channel]
      },120_000)
    }
    else if(data.type == "send" && channels[data.channel]){
      await channels[data.channel].send(JSON.stringify({type:"token",data:data.data}))
      delete channels[data.channel]
    }
  });
})
