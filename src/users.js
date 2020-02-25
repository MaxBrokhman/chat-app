const users = new Map()

const normalizeString = (str) => str.trim().toLowerCase()

const addUser = ({
  id,
  username,
  room,
}) => {
  const name = normalizeString(username)
  const roomName = normalizeString(room)
  const isInfoValid = Boolean(name) && Boolean(roomName)
  if(!isInfoValid) {
    return { 
      error: 'Username and room are required!' 
    }
  }
  for(let [key, value] of users){
    if(value.username === name && value.room === roomName){
      return {
        error: 'Username is already taken!'
      }
    }
  }
  const user = {
    id,
    username: name,
    room: roomName,
  }
  users.set(id, user)
  return { user }
}

const removeUser = (id) => {
  const user = users.get(id)
  if(user){
    users.delete(id)
    return user
  }
}

const getUser = (id) => users.get(id)

const getUsersInRoom = (roomName) => Array.from(
  users.values()
).filter(user => user.room === roomName)

module.exports = {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser,
}
