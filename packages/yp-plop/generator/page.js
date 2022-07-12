/* eslint-disable indent */
'use strict'

const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
// const ora = require('ora')
const chalk = require('chalk')
const { clearAgrv } = require('yp-utils')
const config = require('../config/complexConfig')
const { getRoutePath, matchRoutePath } = require('../utils/handleRoute')
const { parseTocjs } = require('../utils/parseES')
const { generateCacheFile } = require('../utils/cacheData')

async function checkExit(params) {
  const { views } = config
  const { componentName } = params
  const filePath = path.join(views, componentName)
  if (fs.existsSync(filePath)) {
    throw '该组件名已经存在'
  }
  return params
}

/**
 * 问题交互
 */
async function promptQuestions(params) {
  const cwd = process.cwd()
  const pkg = require(`${cwd}/package.json`)
  // 获取模板类型
  const ypTemplate = pkg['yp-template']

  const { joinMenu, needModel } = await inquirer.prompt([
    ypTemplate === 'middle-web-dva-template' && { // dva 模板才有
      type: 'confirm',
      name: 'needModel',
      message: '组件是否需要dva的model文件？',
      default: false
    },
    {
      type: 'confirm',
      name: 'joinMenu',
      message: '组件是否加入导航菜单'
    }
  ].filter(Boolean))

  if (!joinMenu) {
    return { ...params, joinMenu, needModel }
  }

  const { menuName, isTopMenu } = await inquirer.prompt([
    {
      type: 'input',
      name: 'menuName',
      message: '请输入组件菜单名称',
    },
    {
      type: 'confirm',
      name: 'isTopMenu',
      message: '组件是否设为一级菜单',
    }
  ])

  return { ...params, joinMenu, needModel, menuName, isTopMenu, ypTemplate }
}

/**
 * 生成菜单数据
 */
async function generateMenu(params) {
  const { joinMenu, menuName, isTopMenu } = params

  if (!joinMenu) {
    return params
  }

  try {
    const { menus } = config
    // 获取内容
    let menusContent = parseTocjs(menus)

    const { componentName } = params

    // 记录变化的父菜单名称
    let changedFatherName = ''
    // 首字母小写
    const lowCaseComponentName = getRoutePath(componentName)

    // 不是一级菜单时
    if (!isTopMenu) {
      const { father } = await inquirer.prompt(
        {
          type: 'list',
          name: 'father',
          message: '请选择父级菜单',
          choices: menusContent.map((v) => v.name)
        }
      )

      changedFatherName = father

      // 给 children 添加
      menusContent = menusContent.map((v) => v.name === father
        ? {
          ...v,
          children: v.children.concat([{
            // 原父菜单项
            ...v,
            id: Math.random(),
            route: `${v.route + v.route}`,
          }, {
            // 新增的子菜单项
            id: Math.random(),
            name: menuName,
            icon: '',
            route: `${v.route}/${lowCaseComponentName}`,
          }])
        }
        : v)
    } else {
      // 一级菜单
      menusContent = menusContent.concat({
        id: Math.random(),
        name: menuName,
        icon: '',
        route: `/${lowCaseComponentName}`,
        children: []
      })
    }
    // 清空交互内容
    clearAgrv()

    // 过滤相同路由
    const { uniqueMenus } = menusContent.reduce((pre, next) => {
      if (pre.route.includes(next.route)) {
        return pre
      }
      return {
        route: pre.route.concat(next.route),
        uniqueMenus: pre.uniqueMenus.concat(next)
      }
    }, { route: [], uniqueMenus: [] })
    // 获取菜单文件内容
    const newString = require('../templates/menu')(uniqueMenus)
    // 生成缓存文件
    await generateCacheFile('menus', newString)

    // 记录是否生成menus的缓存文件
    return { ...params, menus: uniqueMenus, changedFatherName, lowCaseComponentName, generatedMenus: true }
  } catch (error) {
    throw `生成导航菜单失败，${error}`
  }
}

/**
 * 生成页面文件
 */
async function generatePages(params) {
  const { ypTemplate } = params

  switch (ypTemplate) {
    case 'middle-web-simple-template':
      await require('./basePage')(params)
      break
    case 'middle-web-dva-template':
      await require('./dvaPage')(params)
      break
    default:
      throw `package.json中不存在 ${chalk.yellow('yp-template')} 属性`
  }
  return { ...params, ypTemplate }
}

/**
 * 修改路由文件
 */
async function generateRoute(params) {
  try {
    const { menus = [], changedFatherName } = params
    const { views } = config

    const files = await fs.readdir(views)

    // 获取views目录下文件夹名以及对于的路由
    const fileList = files.reduce((pre, next) => {
      const filePath = path.join(views, next)
      const isDir = fs.lstatSync(filePath).isDirectory()

      if (!isDir) {
        return pre
      }

      const commonRoute = `/${getRoutePath(next)}` // 通用的路由
      const route = matchRoutePath(menus, commonRoute)
      return pre.concat({ name: next, route })
    }, [])

    const routeFile = require('../templates/router')(fileList)
    // 生成缓存文件
    await generateCacheFile('router', routeFile)

    /**
     * dva 类型的项目的文件编辑在这边结束
     */
    if (changedFatherName) {
      console.log()
      console.log(`菜单结构调整：原父菜单${chalk.cyanBright(changedFatherName)}变为子级菜单`)
    }

    // 记录是否生成router的缓存文件
    return { ...params, generatedRouter: true }
  } catch (error) {
    throw `生成路由文件失败，${error}`
  }
}

module.exports = async function (params) {
  return checkExit(params).then(promptQuestions).then(generateMenu).then(generatePages).then(generateRoute)
}
