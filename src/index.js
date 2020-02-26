const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const {
  addUser,
  getUser,
  removeUser,
} = require('./users')
const {
  messageHandler,
  getRoomData,
} = require('./messages')
const {
  getGoogleMapsCoords,
  getJoinMessage,
  parseSearchString,
  getDisconnectMessage,
} = require('./utils')
const {
  ADMIN,
  WELCOME_MESSAGE,
} = require('./config')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDir = path.join(__dirname, '../public')

app.use(express.static(publicDir))

io.on('connection', (socket) => {

  socket.on('join', (search, acknowledgementCallback) => {
    const { room, username } = parseSearchString(search)
    const { error, user} = addUser({
      id: socket.id,
      username,
      room,
    })
    if(error) {
      return acknowledgementCallback({ error })
    }
    socket.join(user.room)
    socket.emit('message', messageHandler(WELCOME_MESSAGE, ADMIN))
    socket.broadcast.to(user.room).emit('message', messageHandler(getJoinMessage(user.username), ADMIN))
    io.to(user.room).emit('roomData', getRoomData(user.room))
    acknowledgementCallback({ user: username })
  })

  socket.on('sendMessage', (message) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('message', messageHandler(message, user.username))
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    if(user) {
      io.to(user.room).emit('message', messageHandler(getDisconnectMessage(user.username), ADMIN))
      io.to(user.room).emit('roomData', getRoomData(user.room))
    }
  })

  socket.on('shareLocation', ({ lat, long }, acknowledgementCallback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('locationMessage', messageHandler(getGoogleMapsCoords(lat, long), user.username))
    acknowledgementCallback('Location shared!')
  })
})

const port = process.env.PORT || 3000

server.listen(port)
