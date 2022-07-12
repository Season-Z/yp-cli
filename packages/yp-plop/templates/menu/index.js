module.exports = function (configMenu) {
  return `
  /**
 * 左侧菜单
 */
const configMenu = ${JSON.stringify(configMenu)}

export default configMenu;
  `
}
