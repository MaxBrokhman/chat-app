const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDir = path.join(__dirname, '../public')

const getGoogleMapsCoords = (lat, long) => `https://google.com/maps?q=${lat},${long}`

app.use(express.static(publicDir))

io.on('connection', (socket) => {
  console.log('Connected!')

  socket.broadcast.emit('message', 'New user has joined!')

  socket.on('sendMessage', (message) => {
    socket.emit('message', message)
    console.log('new message received ', message)
  })

  socket.on('disconnect', () => {
    io.emit('message', 'User has been disconnected')
  })

  socket.on('shareLocation', ({ lat, long }, acknowledgementCallback) => {
    io.emit('message', getGoogleMapsCoords(lat, long))
    acknowledgementCallback('Location shared!')
  })
})

const port = process.env.PORT || 3000

server.listen(port)
