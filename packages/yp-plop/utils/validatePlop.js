const path = require('path')
const { checkEnvironment, shouldUpdate, clearAgrv } = require('yp-utils')
const pkg = require('../package.json')

/**
 * 校验名称，目录名称
 */
async function validatePlop(name, ...options) {
  // 检查node环境
  await checkEnvironment(pkg)

  const versionPath = path.join(__dirname, '../utils/version.txt')
  // 检查是否更新
  await shouldUpdate(pkg, versionPath)

  clearAgrv()

  return { componentName: name, }
}

module.exports = validatePlop
