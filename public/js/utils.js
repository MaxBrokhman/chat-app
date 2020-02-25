const getDate = (time) => new Date(time).toLocaleDateString()
const getTime = (time) => new Date(time).toLocaleTimeString()
export const getLocalTime = (time) => `${getDate(time)} ${getTime(time)}`
