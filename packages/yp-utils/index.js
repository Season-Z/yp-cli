const binGenerator = require('./lib/binGenerator')
const checkName = require('./lib/checkName')
const checkEnvironment = require('./lib/checkEnvironment')
const checkVersion = require('./lib/checkVersion')
const clearAgrv = require('./lib/clearAgrv')
const shouldUpdate = require('./lib/shouldUpdate')
const getDepVersion = require('./lib/getDepVersion')
const tool = require('./lib/tool')

module.exports = {
  binGenerator,
  checkName,
  checkEnvironment,
  checkVersion,
  clearAgrv,
  shouldUpdate,
  getDepVersion,
  ...tool
}
