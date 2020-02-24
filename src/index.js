const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser,
} = require('./users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDir = path.join(__dirname, '../public')

const getGoogleMapsCoords = (lat, long) => `https://google.com/maps?q=${lat},${long}`

const ADMIN = 'Admin'

const messageHandler = (message, user) => ({
  message,
  time: new Date().getTime(),
  user,
})

const parseKeyStr = (str) => str.replace(/[\?&]/, '')
const breakQueryStr = (str) => str.split('=')

const queryStr = /[\?&]\w*=(\w*\+?\w*)*/gi

app.use(express.static(publicDir))

io.on('connection', (socket) => {

  socket.on('join', (search, acknowledgementCallback) => {
    const matches = search.match(queryStr)
    const searchOptions = {}
    matches.reduce((acc, str) => {
      const parsedStr = parseKeyStr(str)
      const strArr = breakQueryStr(parsedStr)
      const [key, value] = strArr
      acc[key] = value
      return acc
    }, searchOptions)

    const { room, username } = searchOptions
    const { error, user} = addUser({
      id: socket.id,
      username,
      room,
    })
    if(error) {
      return acknowledgementCallback({ error })
    }
    socket.join(user.room)
    socket.emit('message', messageHandler('Welcome to the chat!', ADMIN))
    socket.broadcast.to(user.room).emit('message', messageHandler(`${user.username} has joined!`, ADMIN))

    acknowledgementCallback({ user: username })
  })

  socket.on('sendMessage', (message) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('message', messageHandler(message, user.username))
    console.log('new message received ', message)
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    user && io.to(user.room).emit('message', messageHandler(`${user.username} has been disconnected`, ADMIN))
  })

  socket.on('shareLocation', ({ lat, long }, acknowledgementCallback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('locationMessage', messageHandler(getGoogleMapsCoords(lat, long), user.username))
    acknowledgementCallback('Location shared!')
  })
})

const port = process.env.PORT || 3000

server.listen(port)
