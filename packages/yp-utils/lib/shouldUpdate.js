const semver = require('semver')
// const path = require('path')
const ora = require('ora')
const chalk = require('chalk')
const inquirer = require('inquirer')
const { execSync } = require('child_process')

const { hasCnpm } = require('./tool')
const checkVersion = require('./checkVersion')

const bin = hasCnpm() ? 'cnpm' : 'npm'

/**
 * 校验版本，是否需要更新
 * @param {*} pkg package.json 文件
 * @param {*} versionPath 记录校验版本的时间戳文件
 */
module.exports = async function (pkg, versionPath) {
  const { version, name } = pkg
  const lastVersion = checkVersion({ filePath: versionPath, name }) || '1.0.0'

  if (lastVersion && semver.gt(lastVersion, version)) {
    const { ok } = await inquirer.prompt([
      {
        type: 'confirm',
        message: `最新版本是 ${lastVersion} ，需要更新吗？`,
        name: 'ok',
      },
    ])

    if (ok) {
      const spinner = ora(`正在准备更新 ${name} ...`)
      spinner.start()

      execSync(`${bin} update ${name} -g`)
      spinner.succeed(chalk.green(`${name} 已经更新至 ${lastVersion}`))
    }
  }
}
