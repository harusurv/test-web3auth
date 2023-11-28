var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({port: 40510})

const channels = {}
wss.on('connection', function (ws) {
  ws.on('message', function(message) {
    const data = JSON.parse(message)
    if(data.type == "subscribe"){
      channels[data.channel] = ws
    }
    else if(data.type == "send" && channels[data.channel]){
      channels[data.channel].send(data.data)
    }
  });
})
