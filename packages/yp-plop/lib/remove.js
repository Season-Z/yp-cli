'use strict'

/**
 * 删除组件
 */
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs-extra')
const validatePlop = require('../utils/validatePlop')
const config = require('../config/complexConfig')

/**
 * 寻找公共组件文件并删除
 */
async function findComponentsAndDel(params) {
  const { componentName } = params
  const { components, views } = config

  // 获取文件绝对路径
  const componentsPath = path.join(components, componentName)
  const viewsPath = path.join(views, componentName)

  // 是否存在
  const existsComponent = fs.existsSync(componentsPath)
  const existsViews = fs.existsSync(viewsPath)

  if (existsComponent && !existsViews) {
    fs.removeSync(componentsPath)
    return { ...params, done: true }
  } else if (existsComponent && existsViews) {
    const { witch } = await inquirer.prompt({
      type: 'list',
      name: 'witch',
      message: '要删除的是公共组件还是页面路由组件？',
      choices: [{ value: 'component', name: '公共组件' }, { value: 'route', name: '页面路由组件' }]
    })

    if (witch === 'component') {
      fs.removeSync(componentsPath)
      return { ...params, done: true }
    }
  }

  return { ...params, viewsPath }
}

/**
 * 结束
 */
async function final(params) {
  const { componentName } = params
  console.log()
  console.log(`🎉 成功删除组件：${componentName}`)
  console.log()

  return params
}

/**
 * 通过params返回的done属性来判断，当前操作是否结束
 */
module.exports = async function (params) {
  const result = await validatePlop(params).then(findComponentsAndDel)

  if (result.done) {
    return final(result)
  }

  let data = {}
  try {
    const pkg = require(`${process.cwd()}/package.json`)
    const templateType = pkg['yp-template']

    switch (templateType) {
      case 'middle-web-simple-template':
        data = await require('../delete/basePage')(result)
        break
      case 'middle-web-dva-template':
        data = await require('../delete/dvaPage')(result)
        break
      default:
        break
    }
  } catch (error) {
    console.log(`删除失败，${error}`)
    process.exit(1)
  }

  if (data.done) {
    await final(data)
  } else {
    console.log('删除失败')
    process.exit(1)
  }
}
