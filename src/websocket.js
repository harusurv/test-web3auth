var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({port: 40510})

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
