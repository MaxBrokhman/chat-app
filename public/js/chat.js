const socket = io()

const messageForm = document.querySelector('.message-form')
const messageInput = document.querySelector('.message-input')
const locationBtn = document.querySelector('.location-btn')
const messagesContainer = document.querySelector('.messages-container')
const messageClassName = 'chat-message'
const locationMessageClassName = 'location-message'
const userSpanClassName = 'message__user-name'
const timeSpanClassName = 'message__time'
const locationLinkClassName = 'location-message__link'
const getDate = (time) => new Date(time).toLocaleDateString()
const getTime = (time) => new Date(time).toLocaleTimeString()
const getLocalTime = (time) => `${getDate(time)} ${getTime(time)}`
const getMessageWithTime = ({ message, time }) => `${getLocalTime(time)} - ${message || ''}`
const locationMessage = `My current location`

const dummyUser = 'Dummy User'

const createMessage = ({ message, time }) => {
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
  userNameStr.textContent = dummyUser
  timeBody.appendChild(userNameStr)
  timeBody.appendChild(timeStr)
  container.appendChild(timeBody)
  container.appendChild(messageBody)
  return container
}

const createLocationMessage = ({ message, time }) => {
  const container = document.createElement('div')
  container.classList.add(messageClassName, locationMessageClassName)
  const messageBody = document.createElement('p')
  const timeBody = document.createElement('p')
  const timeStr = document.createElement('span')
  timeStr.classList.add(timeSpanClassName)
  const userNameStr = document.createElement('span')
  userNameStr.classList.add(userSpanClassName)
  timeStr.textContent = getLocalTime(time)
  userNameStr.textContent = dummyUser
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

const addMessage = (elm) => messagesContainer.appendChild(elm)

messageForm.addEventListener('submit', (evt) => {
  evt.preventDefault()
  messageInput.value && socket.emit('sendMessage', messageInput.value)
  messageInput.value = ''
  messageInput.focus()
})

socket.on('message', (res) => {
  console.log('Message received on client side ', res.message)
  addMessage(createMessage(res))
})

socket.on('locationMessage', (message) => {
  addMessage(createLocationMessage(message))
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
