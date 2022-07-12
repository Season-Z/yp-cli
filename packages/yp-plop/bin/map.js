const chalk = require('chalk')
const minimist = require('minimist')

const map = {
  create: {
    command: 'create <component-name>',
    alias: 'c',
    description: '创建路由组件模板（驼峰式命名）',
    examples: ['yp-plop create <component-name>'],
    validate: (value) => {
      if (minimist(process.argv.slice(3))._.length > 1) {
        console.log(chalk.red('检测到您输入了多个名称，将以第一个参数为组件名称，舍弃后续参数哦'))
        process.exit(1)
      }
      if (!value.match(/^.*[A-Z]+.*$/)) {
        console.log(chalk.red('组件名应以大写开头'))
        process.exit(1)
      }
    }
  },
  remove: {
    command: 'remove <component-name>',
    alias: 'r',
    description: '删除组件以及连带的配置信息',
    examples: ['yp-plop remove <component-name>'],
    validate: () => {
      if (minimist(process.argv.slice(3))._.length > 1) {
        console.log(chalk.red('检测到您输入了多个名称，将以第一个参数为组件名称，舍弃后续参数哦'))
        process.exit(1)
      }
    }
  },
  // update: {
  //   command: 'update',
  //   description: '更新生成器',
  //   examples: ['yp-plop update'],
  //   validate: () => {
  //     if (minimist(process.argv.slice(3))._.length > 0) {
  //       console.log(chalk.red('检测到您多输入了参数，我猜您可能想输入 yp-plop update'))
  //       process.exit(1)
  //     }
  //   }
  // }
}

const keys = Reflect.ownKeys(map)

module.exports = { map, keys }
