const fs = require('fs-extra')
exports.parseTocjs = function (paths) {
  const contentString = fs.readFileSync(paths).toString()
  // 转为 commonJS 语法
  // TODO 解析ts
  const commonJSContent = contentString.replace(/export default/, 'module.exports=')
  // 获取菜单列表
  // eslint-disable-next-line no-eval
  return eval(commonJSContent)
}
