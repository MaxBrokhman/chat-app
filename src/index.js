const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDir = path.join(__dirname, '../public')

const getGoogleMapsCoords = (lat, long) => `https://google.com/maps?q=${lat},${long}`

const messageHandler = (message) => ({
  message,
  time: new Date().getTime(),
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

    const { roomname, username } = searchOptions
    socket.join(roomname)
    socket.emit('message', messageHandler('Welcome to the chat!'))

    socket.broadcast.to(roomname).emit('message', messageHandler(`${username} has joined!`))
    acknowledgementCallback(username)
  })

  

  socket.on('sendMessage', (message) => {
    socket.emit('message', messageHandler(message))
    console.log('new message received ', message)
  })

  socket.on('disconnect', () => {
    io.emit('message', messageHandler('User has been disconnected'))
  })

  socket.on('shareLocation', ({ lat, long }, acknowledgementCallback) => {
    io.emit('locationMessage', messageHandler(getGoogleMapsCoords(lat, long)))
    acknowledgementCallback('Location shared!')
  })
})

const port = process.env.PORT || 3000

server.listen(port)
