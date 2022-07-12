/**
 * 返回开头小写的字符串
 */
exports.getRoutePath = function (name) {
  return name.charAt(0).toLocaleLowerCase() + name.slice(1)
}

/**
 * 从菜单路由中，模糊匹配出完整的路由信息
 * @param {array} list 菜单路由
 * @param {string} path 要匹配的路由
 */
exports.matchRoutePath = function (list, path) {
  let route = path
  function search(data) {
    for (const iterator of data) {
      if (iterator.route.includes(path) && (!iterator.children || !iterator.children.length)) {
        route = iterator.route
        break
      }

      if (iterator.children && iterator.children.length) {
        search(iterator.children)
      }
    }
  }

  search(list)

  return route
}
