'use strict'

module.exports = function (filename, ...args) {
  require(`./${filename}`)(...args)
}
