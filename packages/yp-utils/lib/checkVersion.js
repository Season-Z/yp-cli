const fs = require('fs-extra')
const getDepVersion = require('./getDepVersion')

const EXPIRES_TIME = 86400000

module.exports = function ({ filePath, name }) {
  const lastTimeStr = fs.readFileSync(filePath).toString()
  const lastTime = Number(lastTimeStr)
  const currentTime = new Date().getTime()

  if (lastTime && currentTime - lastTime < EXPIRES_TIME) {
    return
  }

  fs.writeFileSync(filePath, currentTime.toString())

  return getDepVersion(name)
}
