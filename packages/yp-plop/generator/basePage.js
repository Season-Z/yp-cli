
'use strict'

/**
 * 生成基础页面
 */

const nodePlop = require('node-plop')
const path = require('path')
const ora = require('ora')

/**
 * 生成文件
 */
async function generateTemplate(params) {
  const spinner = ora('正在生成页面文件...')
  try {
    spinner.start()
    const { componentName } = params
    const plopPath = path.resolve(__dirname, '../plops/basePagePlop.js')

    const plop = nodePlop(plopPath)
    // 获取生成器的名称
    const { name: generatorName } = plop.getGeneratorList()[0]

    // 获取生成器的对象
    const generator = plop.getGenerator(generatorName)
    // 执行
    await generator.runActions({ name: componentName })

    spinner.succeed('生成页面文件成功')

    return params
  } catch (error) {
    spinner.stop()
    throw `生成页面失败，${error}`
  }
}

module.exports = function (params) {
  return generateTemplate(params)
}
