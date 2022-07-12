'use strict'
/**
 * 删除 dva 项目的模块
 */
const fs = require('fs-extra')
const inquirer = require('inquirer')
const path = require('path')
const chalk = require('chalk')
const { clearAgrv } = require('yp-utils')
const baseDelete = require('./basePage')
const config = require('../config/complexConfig')

/**
 * 校验检查model文件
 */
async function checkAndDelModelFile(params) {
  const { models, services } = config
  const { componentName } = params

  // model 文件默认小写
  const modelName = `${componentName.toLocaleLowerCase()}.ts`

  const modelsPath = path.join(models, modelName)
  const servicesPath = path.join(services, modelName)

  const existModel = fs.existsSync(modelsPath)
  const existService = fs.existsSync(servicesPath)

  if (existModel && existService) {
    const { filename } = await inquirer.prompt({
      type: 'checkbox',
      name: 'filename',
      message: `检测到${chalk.cyan('models')}和${chalk.cyan('services')}目录下存在关联文件${chalk.cyan(modelName)}，请选择是否删除`,
      choices: [{ value: modelsPath, name: 'models目录' }, { value: servicesPath, name: 'services目录' }],
      default: [modelsPath, servicesPath]
    })

    if (filename.length > 0) {
      filename.forEach(v => fs.removeSync(v))
      return { ...params, done: false, modelName }
    }
  } else if (existModel && !existService) {
    const { ok } = await inquirer.prompt({
      type: 'confirm',
      name: 'ok',
      message: `检测到${chalk.cyan('models')}目录下存在关联文件${chalk.cyan(modelName)}，是否删除？`,
      default: true
    })

    if (ok) {
      fs.removeSync(modelsPath)
      return { ...params, done: false, modelName }
    }
  } else if (!existModel && existService) {
    const { ok } = await inquirer.prompt({
      type: 'confirm',
      name: 'ok',
      message: `检测到${chalk.cyan('services')}目录下存在关联文件${chalk.cyan(modelName)}，是否删除？`,
      default: true
    })
    if (ok) {
      fs.removeSync(servicesPath)
    }
  }
  return { ...params, done: true }
}

/**
 * 检测，删除根目录文件引入的model方法
 */
async function checkAndDelRequire(params) {
  const { done, modelName } = params

  if (done) {
    return params
  }

  // 在根目录中引入
  const { src } = require('../config/complexConfig')
  const entryPath = path.join(src, './index.ts')

  if (!fs.existsSync(entryPath)) {
    throw `请确认${chalk.cyan('src')}文件夹下存在${chalk.cyan('index.ts')}文件`
  }

  const entryContent = fs.readFileSync(entryPath).toString()
  const resultContent = entryContent.replace(`app.model(require('./models/${modelName}').default)`, '')

  // 生成文件
  await fs.writeFile(entryPath, resultContent)
  clearAgrv()

  return { ...params, done: true }
}

module.exports = function (params) {
  return baseDelete(params).then(checkAndDelModelFile).then(checkAndDelRequire)
}
