import {
  messageClassName,
  locationMessageClassName,
  userSpanClassName,
  timeSpanClassName,
  locationLinkClassName,
  locationMessage,
} from './config.js'
import { getLocalTime } from './utils.js'

export const createLocationMessage = ({ 
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

export const createRoomList = (room, users) => {
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

export const createMessage = ({ 
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
