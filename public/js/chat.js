const socket = io()

const messageForm = document.querySelector('.message-form')
const messageInput = document.querySelector('.message-input')
const locationBtn = document.querySelector('.location-btn')
const messagesContainer = document.querySelector('.messages-container')
const sideBar = document.querySelector('.chat-side-bar')
const messageClassName = 'chat-message'
const locationMessageClassName = 'location-message'
const userSpanClassName = 'message__user-name'
const timeSpanClassName = 'message__time'
const locationLinkClassName = 'location-message__link'
const getDate = (time) => new Date(time).toLocaleDateString()
const getTime = (time) => new Date(time).toLocaleTimeString()
const getLocalTime = (time) => `${getDate(time)} ${getTime(time)}`
const getMessageWithTime = ({ message, time }) => `${getLocalTime(time)} - ${message || ''}`

const searchQuery = location.search

const locationMessage = `My current location`

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

const createMessage = ({ 
  message, 
  time, 
  user, 
}) => {
  const container = document.createElement('div')
  container.classList.add(messageClassName)
  const messageBody = document.createElement('p')
  const timeBody = document.createElement('p')
  const timeStr = document.createElement('span')
  timeStr.classList.add(timeSpanClassName)
  const userNameStr = document.createElement('span')
  userNameStr.classList.add(userSpanClassName)
  messageBody.textContent = message
  timeStr.textContent = getLocalTime(time)
  userNameStr.textContent = user || ''
  timeBody.appendChild(userNameStr)
  timeBody.appendChild(timeStr)
  container.appendChild(timeBody)
  container.appendChild(messageBody)
  return container
}

const createLocationMessage = ({ 
  message, 
  time, 
  user, 
}) => {
  const container = document.createElement('div')
  container.classList.add(messageClassName, locationMessageClassName)
  const messageBody = document.createElement('p')
  const timeBody = document.createElement('p')
  const timeStr = document.createElement('span')
  timeStr.classList.add(timeSpanClassName)
  const userNameStr = document.createElement('span')
  userNameStr.classList.add(userSpanClassName)
  timeStr.textContent = getLocalTime(time)
  userNameStr.textContent = user || ''
  timeBody.appendChild(userNameStr)
  timeBody.appendChild(timeStr)
  const locationLink = document.createElement('a')
  locationLink.setAttribute('href', message)
  locationLink.setAttribute('title', locationMessage)
  locationLink.setAttribute('target', '_blank')
  locationLink.classList.add(locationLinkClassName)
  locationLink.textContent = locationMessage
  messageBody.appendChild(locationLink)
  container.appendChild(timeBody)
  container.appendChild(messageBody)
  return container
}

const createRoomList = (room, users) => {
  const container = document.createDocumentFragment()
  const header = document.createElement('h2')
  header.textContent = room
  header.classList.add('room-header')
  container.appendChild(header)
  const usersHeader = document.createElement('h3')
  usersHeader.classList.add('users-list-title')
  usersHeader.textContent = 'Users'
  container.appendChild(usersHeader)
  const usersList = document.createElement('ul')
  usersList.classList.add('users-list')
  users.forEach(user => {
    const listItem = document.createElement('li')
    listItem.classList.add('users-list-item')
    listItem.textContent = user.username
    usersList.appendChild(listItem)
  })
  container.appendChild(usersList)
  return container
}

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
