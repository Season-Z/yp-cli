/**
 * 更新
 */
const semver = require('semver')
const ora = require('ora')
const chalk = require('chalk')
const path = require('path')
const { execSync } = require('child_process')
const pkg = require('../package.json')
const { hasCnpm, checkVersion } = require('yp-utils')

const bin = hasCnpm() ? 'cnpm' : 'npm'

module.exports = function () {
  const { name, version } = pkg

  const filePath = path.join(__dirname, '../config/version.txt')
  // 校验版本号
  const lastVersion = checkVersion({ filePath, name }) || '1.0.0'

  // 对比当前的版本
  if (lastVersion && semver.gt(lastVersion, version)) {
    const spinner = ora(`正在准备更新 ${name} ...`)
    spinner.start()

    execSync(`${bin} update ${name} -g`)
    spinner.succeed(chalk.green(`${name} 已经更新至 ${lastVersion}`))
  } else {
    console.log(`${name} 已经是最新版本了`)
  }
}
