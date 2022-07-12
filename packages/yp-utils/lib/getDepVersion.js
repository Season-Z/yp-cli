const { execSync } = require('child_process')

/**
 * 获取依赖的版本号
 * @param {*} name 依赖名称
 */
module.exports = function (name) {
  let version = ''

  try {
    version = execSync(`npm view ${name} version`, {
      encoding: 'utf8',
    })
    version = version ? version.replace(/[\r\n]/g, '') : ''
  } catch (error) { }
  return version
}
