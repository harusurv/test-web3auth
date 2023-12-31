const { createServer } = require('https');
const { readFileSync } = require('fs');
var WebSocketServer = require('ws').Server
const server = createServer({
  key: readFileSync("/etc/letsencrypt/live/infinitysocial.ddns.net/privkey.pem"),
  cert: readFileSync("/etc/letsencrypt/live/infinitysocial.ddns.net/cert.pem")
});
wss = new WebSocketServer({server})
const channels = {}
wss.on('connection', function (ws) {
  ws.on('message', async function(message) {
    try{
      const data = JSON.parse(message)
      if(data.type == "subscribe"){
        channels[data.channel] = ws
        setTimeout(()=>{
          delete channels[data.channel]
        },120_000)
      }
      else if(data.type == "send" && data.channel && channels[data.channel]){
        await channels[data.channel].send(JSON.stringify({type:"token",data:data.data}))
        channels[data.channel].close()
        delete channels[data.channel]
      }
    }
    catch(e){

    }

  });
  ws.onerror = function () {
    console.log('websocket error')
  }
})
server.listen(40510, () => console.log(`Listening on ${40510}`));
server.onerror = (e) => {
  console.error(e)
}
