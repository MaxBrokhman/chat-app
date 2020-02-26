const { queryStr } = require('./config')

const getGoogleMapsCoords = (lat, long) => `https://google.com/maps?q=${lat},${long}`
const getJoinMessage = (user) => `${user} has joined!`
const getDisconnectMessage = (user) => `${user} has been disconnected`

const parseKeyStr = (str) => str.replace(/[\?&]/, '')
const breakQueryStr = (str) => str.split('=')

const parseSearchString = (search) => {
  const matches = search.match(queryStr)
  const searchOptions = {}
  return matches.reduce((acc, str) => {
    const parsedStr = parseKeyStr(str)
    const strArr = breakQueryStr(parsedStr)
    const [key, value] = strArr
    acc[key] = value
    return acc
  }, searchOptions)
}

module.exports = {
  getGoogleMapsCoords,
  parseKeyStr,
  getJoinMessage,
  breakQueryStr,
  parseSearchString,
  getDisconnectMessage,
}
