'use strict'

/**
 * 生成dva页面
 */

const nodePlop = require('node-plop')
const path = require('path')
const ora = require('ora')
const fs = require('fs-extra')
const chalk = require('chalk')

/**
 * 生成文件
 */
async function generateTemplate(params) {
  const spinner = ora('正在生成组件...')
  try {
    spinner.start()
    const { componentName, lowCaseComponentName, needModel } = params

    const plopPath = path.resolve(__dirname, '../plops/dvaPagePlop.js')
    const plop = nodePlop(plopPath)
    // 获取生成器的名称
    const { name: generatorName } = plop.getGeneratorList()[0]

    // 获取生成器的对象
    const generator = plop.getGenerator(generatorName)
    // 执行
    await generator.runActions({ name: componentName, modalName: lowCaseComponentName, needModel })

    spinner.succeed('组件生成成功')

    return params
  } catch (error) {
    spinner.stop()
    throw `生成页面失败，${error}`
  }
}

/**
 * 是否生成model文件
 */
async function generateModel(params) {
  const { lowCaseComponentName, needModel } = params

  if (!needModel) {
    return params
  }

  const spinner = ora('正在生成model...')
  try {
    spinner.start()

    // 在根目录中引入
    const { src } = require('../config/complexConfig')
    const entry = path.join(src, './index.ts')

    if (!fs.existsSync(entry)) {
      throw `请确认${chalk.cyan('src')}文件夹下存在${chalk.cyan('index.ts')}文件`
    }

    await fs.appendFile(entry, `app.model(require('./models/${lowCaseComponentName}.ts').default)\n`)

    spinner.succeed('model生成成功')
  } catch (error) {
    spinner.stop()
    throw `生成model文件失败，${error}`
  }
}

module.exports = function (params) {
  return generateTemplate(params).then(generateModel)
}
