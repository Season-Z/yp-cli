const path = require('path')

module.exports = function resolvePath(paths) {
  return path.resolve(__dirname, paths)
}
