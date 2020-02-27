const ADMIN = 'Admin'
const queryStr = /[\?&]\w*=(\w*\+?\w*)*/gi
const WELCOME_MESSAGE = 'Welcome to the chat!'
const EMPTY_USERNAME_ERROR_MESSAGE = 'Username and room are required!'
const DUPLICATE_USERNAME_ERROR_MESSAGE = 'Username is already taken!'

module.exports = {
  ADMIN,
  queryStr,
  WELCOME_MESSAGE,
  EMPTY_USERNAME_ERROR_MESSAGE,
  DUPLICATE_USERNAME_ERROR_MESSAGE,
}
