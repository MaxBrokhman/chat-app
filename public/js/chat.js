const socket = io()

const messageForm = document.querySelector('#message-form')
const messageInput = document.querySelector('#message-input')
const locationBtn = document.querySelector('#location-btn')

messageForm.addEventListener('submit', (evt) => {
  evt.preventDefault()
  messageInput.value && socket.emit('sendMessage', messageInput.value)
})

socket.on('message', (message) => {
  console.log('Message received on client side ', message)
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
