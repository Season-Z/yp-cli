'use strict'

/**
 * 删除基础页面组件
 */
const path = require('path')
const fs = require('fs-extra')
const config = require('../config/complexConfig')
const { getRoutePath, matchRoutePath } = require('../utils/handleRoute')
const { parseTocjs } = require('../utils/parseES')

/**
 * 删除菜单目录项
 */
async function deleteMenuItem(params) {
  const { viewsPath, componentName } = params
  const { menus } = config
  const route = `/${getRoutePath(componentName)}`

  const menusContent = parseTocjs(menus)

  const menusList = menusContent.filter((v) => {
    if (v.route.endsWith(route)) {
      return false
    } else {
      if (v.children) {
        return v.children.filter(k => !k.route.endsWith(route))
      }
      return true
    }
  })

  // 生成删除后新的menu文件
  const newString = require('../templates/menu')(menusList)
  await fs.writeFile(menus, newString)

  // 删除views页面文件
  await fs.remove(viewsPath)

  return { ...params, newMenus: menusList }
}

/**
 * 删除路由项
 */
async function deleteRouterItem(params) {
  const { newMenus } = params
  const { views, router } = config
  const files = await fs.readdir(views)
  // 获取views目录下文件夹名以及对于的路由
  const fileList = files.reduce((pre, next) => {
    const filePath = path.join(views, next)
    const isDir = fs.lstatSync(filePath).isDirectory()

    if (!isDir) {
      return pre
    }

    const commonRoute = `/${getRoutePath(next)}` // 通用的路由
    const route = matchRoutePath(newMenus, commonRoute)
    return pre.concat({ name: next, route })
  }, [])

  const routeFile = require('../templates/router')(fileList)
  await fs.writeFile(router, routeFile)

  return params
}

module.exports = async function (params) {
  return deleteMenuItem(params).then(deleteRouterItem)
}
