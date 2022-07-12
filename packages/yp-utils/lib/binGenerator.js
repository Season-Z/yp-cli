const vm = require('vm')
const chalk = require('chalk')
const program = require('commander')

module.exports = function ({ pkg, files, map, keys }) {
  // 生成命令
  const script = new vm.Script(`program
    .command(command)
    .alias(alias)
    .description(description)
    .action(async (...args) => {
      // 如果存在校验函数
      if (validate && typeof validate === 'function') {
        await validate(...args)
      }
      files(name, ...args)
    })
  `)
  const context = keys.map((v) => {
    const { command, alias, description, validate } = map[v]
    return {
      command,
      alias: alias || '',
      description: description || '',
      validate,
      program,
      files,
      name: v
    }
  })

  context.forEach((v) => {
    vm.createContext(v)
    script.runInContext(v)
  })

  // keys.forEach((name) => {
  //   const { command, alias, description, validate } = map[name]
  //   program
  //     .command(command)
  //     .alias(alias || '')
  //     .description(description || '')
  //     .action(async (...args) => {
  //       // 如果存在校验函数
  //       if (validate && typeof validate === 'function') {
  //         await validate(...args)
  //       }
  //       files(name, ...args)
  //     })
  // })

  // 添加 --help 输出的内容
  program.on('--help', () => {
    console.log('Examples: ')
    keys.forEach((coms) => {
      const { examples } = map[coms]
      const examplesMsg = examples.join('\n').trim()
      console.log(`  ${examplesMsg}`)
    })
  })

  // 没有参数时，输出配置信息
  if (!process.argv.slice(2).length) {
    program.outputHelp()
  }

  program.arguments('<command>').action((cmd) => {
    console.log(`${chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)}`)
    console.log()
    program.outputHelp()
  })

  program.version(pkg.version, '-v, --version')
    .usage('<command> [options]')

  program.parse(process.argv) // 解析变量

  function onError(err) {
    console.error(chalk.red(err.message))
    process.exit(1)
  }

  process.on('uncaughtException', onError)
  process.on('unhandledRejection', onError)
}
