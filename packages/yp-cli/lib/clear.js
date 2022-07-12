/**
 * 清除缓存
 */
const chalk = require('chalk')
const fs = require('fs-extra')

const dirname = process.platform === 'win32' ? 'USERPROFILE' : 'HOME'

async function clear() {
  // 缓存目录
  await fs.remove(`${process.env[dirname]}/ypsx`)

  console.log()
  console.log(chalk.green(' 🚀 成功清除本地缓存！'))
  console.log()
}

module.exports = function (...args) {
  return clear(...args)
    .catch((err) => {
      console.clear()
      console.log()
      console.error(chalk.red(err))
      console.log()
      process.exit(-1)
    })
}
