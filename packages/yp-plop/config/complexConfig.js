/**
 * 合并用户自定义的配置文件
 */
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')

const { defaultConfig, unnecessary, directionary, files } = require('./yp.default')
const cwd = process.cwd()

// 引入运行环境的 package.json
const pkg = require(`${cwd}/package.json`)

let unnecessaryFiles = []
try {
  unnecessaryFiles = unnecessary[pkg['yp-template']]
} catch (error) {
  console.log(`获取模板类型失败，请确认项目${chalk.yellow('package.json')}里的${chalk.yellow('yp-template')}属性`)
}

// 校验并返回绝对路径
function validateFilePath(filename, filePath, isValidate, isDir, isFile) {
  const completePath = path.resolve(cwd, filePath)

  if (isValidate) {
    if (!fs.existsSync(completePath)) {
      console.log(`配置错误：${chalk.red(`${filename} 不存在`)}`)
      process.exit(1)
    }

    const isDirectory = fs.statSync(completePath).isDirectory()
    if (!isDirectory && isDir) {
      console.log(`配置错误：${chalk.red(`${filename} 应该是文件夹`)}`)
      process.exit(1)
    }

    if (isDirectory && isFile) {
      console.log(`配置错误：${chalk.red(`${filename} 应该是文件`)}`)
      process.exit(1)
    }
  }

  return completePath
}

// 获取配置文件的路径
function getConfigFilePath(params) {
  const completePathObject = Object.entries(params).reduce((pre, next) => {
    const [filename, filePath] = next

    const isValidate = !unnecessaryFiles.includes(filename)
    const isDir = directionary.includes(filename)
    const isFile = files.includes(filename)
    const file = validateFilePath(filename, filePath, isValidate, isDir, isFile)

    return {
      ...pre,
      [filename]: file
    }
  }, {})
  return completePathObject
}

let customerConfig = {}
try {
  // 默认在根目录
  customerConfig = require(`${cwd}/yp.config.js`)
} catch (err) { }

// 用户是否定义了无效属性
const exitNotDefinedSetting = Object.keys(customerConfig).find((v) => !defaultConfig[v])
if (exitNotDefinedSetting) {
  throw `配置错误：${chalk.cyan('yp.config.js')} 设置了无效属性 ${chalk.yellow(exitNotDefinedSetting)}`
}

// 合并配置
const complexConfig = Object.assign({}, defaultConfig, customerConfig)

// 获取绝对路径
const completePathConfig = getConfigFilePath(complexConfig)

module.exports = completePathConfig
