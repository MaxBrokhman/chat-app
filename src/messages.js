const { getUsersInRoom } = require('./users')

const getRoomData = (room) => ({
  room,
  users: getUsersInRoom(room)
})

const messageHandler = (message, user) => ({
  message,
  time: new Date().getTime(),
  user,
})

module.exports = {
  getRoomData,
  messageHandler,
}
