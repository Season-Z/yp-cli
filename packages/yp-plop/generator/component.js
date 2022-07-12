'use strict'

const nodePlop = require('node-plop')
const path = require('path')
const fs = require('fs-extra')
const config = require('../config/complexConfig')

async function checkExit(params) {
  const { components } = config
  const { componentName } = params
  const filePath = path.join(components, componentName)

  if (fs.existsSync(filePath)) {
    throw '该组件名已经存在'
  }
  return params
}

/**
 * 生成文件
 */
function generateTemplate(params) {
  const { componentName } = params
  const plopPath = path.resolve(__dirname, '../plops/componentPlop.js')

  const plop = nodePlop(plopPath)
  // 获取生成器的名称
  const { name: generatorName } = plop.getGeneratorList()[0]
  // 获取生成器的对象
  const generator = plop.getGenerator(generatorName)
  // 执行
  generator.runActions({ name: componentName })
}

module.exports = function (params) {
  return checkExit(params).then(generateTemplate)
}
