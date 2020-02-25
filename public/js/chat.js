import { 
  createLocationMessage,
  createRoomList,
  createMessage,
} from './messages.js'

const socket = io()

const messageForm = document.querySelector('.message-form')
const messageInput = document.querySelector('.message-input')
const locationBtn = document.querySelector('.location-btn')
const messagesContainer = document.querySelector('.messages-container')
const sideBar = document.querySelector('.chat-side-bar')

const searchQuery = location.search

const autoScroll = () => {
  const newMessage = messagesContainer.lastElementChild
  const newMessageStyles = getComputedStyle(newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin

  const scrollOffset = messagesContainer.offsetHeight + messagesContainer.scrollTop
  const messagesContainerHeight = messagesContainer.scrollHeight
  if(messagesContainerHeight - newMessageHeight <= scrollOffset){
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }
}

socket.emit('join', searchQuery, ({ error, user }) => {
  if(error) {
    alert(error)
    location.href = '/'
    return error
  }
})

const addMessage = (elm) => messagesContainer.appendChild(elm)

messageForm.addEventListener('submit', (evt) => {
  evt.preventDefault()
  messageInput.value && socket.emit('sendMessage', messageInput.value)
  messageInput.value = ''
  messageInput.focus()
})

locationBtn.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    socket.emit('shareLocation', {
      lat: coords.latitude,
      long: coords.longitude,
    }, 
    (acknowledgement) => {
      console.log(acknowledgement)
    })
  })
})

socket.on('message', (res) => {
  addMessage(createMessage(res))
  autoScroll()
})

socket.on('locationMessage', (res) => {
  addMessage(createLocationMessage(res))
  autoScroll()
})

socket.on('roomData', ({ room, users }) => {
  while(sideBar.children.length){
    sideBar.firstElementChild.remove()
  }
  sideBar.appendChild(createRoomList(room, users))
})
