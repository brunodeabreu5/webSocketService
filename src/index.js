//importamos as bibliotecas necessárias
const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()
const app2 = express()
const server1 = require('http').Server(app)
//const localStorage = require('localStorage').Server
const server2 = require('http').Server(app2)
const WebSocketserver2 = require('websocket').server
const WebSocketserver = require('websocket').server

app.set('porta', 3000)
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, './public')))
app2.set('porta', 4000)
app2.use(cors())
app2.use(express.json())
app2.use(express.static(path.join(__dirname, './')))
//Criamos o servidor de soquete e o incorporamos ao servidor de aplicativos
const wsServer = new WebSocketserver({
  httpServer: server1,
  autoAcceptConnections: false
})

//Para evitar qualquer conexão não autorizada, validamos que vem do cliente apropriado, neste caso do mesmo servidor.
function originIsAllowed(origin) {
  if (origin === 'http://localhost:3000') {
    return true
  }
  return false
}

app2.get('/', (request, response) => {
  console.log('Enviada para o servidor 2')
  return response.send('Enviada para o servidor 2')
})

//Quando uma solicitação chega por meio de soquetes, validamos a origem
// Em caso de origem permitida, recebemos a mensagem e a enviamos
// volta para o cliente
wsServer.on('request', request => {
  //Somente solicitações de origens permitidas são aceitas
  if (!originIsAllowed(request.origin)) {
    request.reject()
    console.log(
      new Date() + 'conexão do servidor' + request.origin + 'rejeitada'
    )
    return
  }

  const connection = request.accept(null, request.origin)
  connection.on('message', message => {
    console.log('Mensagem recebida:' + message.utf8Data)
    connection.sendUTF('recebido Servidor 1: ' + message.utf8Data)
    // console.log(localStorage.setItem(message))
    //connection.on('message', message => {
    //  wsServer2(() => {
    //    connection.on('Mensagem recebida:' + message.utf8Data)
    //  })
    //})
  })
  connection.on('close', (reasonCode, description) => {
    console.log('O cliente desconecto!!!')
  })
})

//iniciamos o servidor na porta definida pela variável porta (3000), fizemos isso para o servidor não fica fechando
server1.listen(app.get('porta'), () => {
  console.log('Servidor iniciado na porta:' + app.get('porta'))
})
server2.listen(app2.get('porta'), () => {
  console.log('Servidor iniciado na porta:' + app2.get('porta'))
})
