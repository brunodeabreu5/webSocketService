//Chamado quando o botão Enviar é pressionado
function enviarTexto(event) {
  event.preventDefault()
  event.stopPropagation()
  var campo = event.target.texto
  //Enviamos o valor do campo para o servidor
  doSend(campo.value)
  //vereficando o campo
  campo.value = ''
}
//A função init é executada quando a página termina de carregar
function init() {
  //Conexão com o servidor websocket
  wsConnect()
}
//Invoque esta função para se conectar ao servidor WebSocket
function wsConnect() {
  //Conecte-se ao servidor WebSocket
  WebSocket = new WebSocket('ws://localhost:3000')
  //Atribuição de retorno de chamada
  WebSocket.onopen = function (evt) {
    onOpen(evt)
  }
  WebSocket.onclose = function (evt) {
    onClose(evt)
  }
  WebSocket.onmessage = function (evt) {
    onMessage(evt)
  }
  WebSocket.onerror = function (evt) {
    onError(evt)
  }
}

function wsConnect2() {
  WebSocket = new WebSocket('ws://localhost:4000')
  //Atribuição de retorno de chamada
  WebSocket.onopen2 = function (evt) {
    onOpen(evt)
  }
  WebSocket.onclose2 = function (evt) {
    onClose(evt)
  }
  WebSocket.onmessage2 = function (evt) {
    onMessage(evt)
  }
  WebSocket.onerror2 = function (evt) {
    onError(evt)
  }
}

//É executado quando a conexão Websocket com o servidor é estabelecida
function onOpen(evt) {
  //Ativamos o botão Enviar
  document.getElementById('enviar').disabled = false
  //Enviamos a saudação inicial ao servidor
  doSend('Bem Vindo Cliente WEB')
}
//É executado quando a conexão com o servidor é fechada
function onClose(evt) {
  //Desativamos o botão
  document.getElementById('enviar').disabled = true
  //document.getElementById('mensagem').innerHTML = ''
  console.log('Servidor Desconectado')
  //Tente reconectar a cada 2 segundos
  setTimeout(function () {
    console.log('Tentando Conectar')
    wsConnect()
  }, 2000)
}
//Chamado quando uma mensagem é recebida do servidor
function onMessage(evt) {
  //Adicionamos a mensagem recebida à área de texto
  var area = document.getElementById('mensagem')
  area.innerHTML += evt.data + '\n'
}
//Chamado quando ocorre um erro no WebSocket
function onError(evt) {
  console.log('Error: ' + evt.data)
}
//Envie uma mensagem para o servidor (e imprima no console)
function doSend(message) {
  console.log('Enviando: ' + message)
  WebSocket.send(message)
}

//A função init é chamada quando a página termina de carregar
window.addEventListener('load', init, false)
