'use strict'
/**
 * 创建组件
 */
const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const fs = require('fs-extra')
const { clearAgrv } = require('yp-utils')
const config = require('../config/complexConfig')
const validatePlop = require('../utils/validatePlop')
const { cacheDir, clearCacheFile } = require('../utils/cacheData')

/**
 * 选择生成的模板
 */
async function chooseTemplate(params) {
  const { type } = await inquirer.prompt({
    type: 'list',
    name: 'type',
    message: '请选择生成的组件类型',
    choices: [
      {
        value: 'page',
        name: '页面路由组件'
      },
      {
        value: 'component',
        name: '公共组件'
      }
    ]
  })

  let result
  try {
    switch (type) {
      case 'page':
        result = await require('../generator/page')(params)
        break
      case 'component':
        result = await require('../generator/component')(params)
        break
      default:
        break
    }
  } catch (error) {
    throw error
  }

  return { ...result }
}

/**
 * 结束
 */
async function final(params) {
  const menusSpinner = ora('正在修改菜单文件...')
  const routerSpinner = ora('正在修改路由文件...')
  try {
    const { menus, router } = config
    const { componentName, generatedMenus, generatedRouter } = params

    if (generatedMenus) {
      menusSpinner.start()

      const rs = fs.createReadStream(`${cacheDir}/menus.ts`)
      const ws = fs.createWriteStream(menus)
      rs.pipe(ws)

      menusSpinner.succeed('修改菜单文件成功')
    }

    if (generatedRouter) {
      routerSpinner.start()

      const rs = fs.createReadStream(`${cacheDir}/router.ts`)
      const ws = fs.createWriteStream(router)
      rs.pipe(ws)

      routerSpinner.succeed('修改路由文件成功')
    }

    console.log()
    console.log(`🎉 成功生成组件：${chalk.cyan(componentName)}`)
    console.log()

    return params
  } catch (error) {
    menusSpinner.stop()
    routerSpinner.stop()
    throw '文件错误'
  }
}

module.exports = function (...args) {
  return validatePlop(...args)
    .then(chooseTemplate)
    .then(final)
    .catch((err) => {
      clearAgrv()
      console.log()
      console.error(chalk.red(err))
      console.log()
      process.exit(-1)
    }).finally(() => {
      clearCacheFile()
    })
}
