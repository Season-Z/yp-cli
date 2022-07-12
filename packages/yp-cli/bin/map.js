const chalk = require('chalk')
const minimist = require('minimist')

const map = {
  create: {
    command: 'create <app-name>',
    alias: 'c',
    description: '初始化项目文件',
    examples: ['yp-cli create <app-name>'],
    async validate() {
      if (minimist(process.argv.slice(3))._.length > 1) {
        console.log(chalk.yellow('检测到您输入了多个名称，将以第一个参数为项目名，舍弃后续参数哦'))
        process.exit(1)
      }
    }
  },
  update: {
    command: 'update',
    description: '更新脚手架',
    examples: ['yp-cli update'],
    async validate() {
      if (minimist(process.argv.slice(3))._.length > 0) {
        console.log(chalk.yellow('检测到您多输入了参数，我猜您可能想输入 yp-cli update'))
        process.exit(1)
      }
    }
  },
  clear: {
    command: 'clear',
    alias: 'r',
    description: '删除本地缓存文件',
    examples: ['yp-cli clear'],
    async validate() {
      if (minimist(process.argv.slice(3))._.length > 0) {
        console.log(chalk.yellow('检测到您多输入了参数，我猜您可能想输入 yp-cli clear'))
        process.exit(1)
      }
    }
  }
}

const keys = Reflect.ownKeys(map)

module.exports = { map, keys }
