const config = require('../config/complexConfig')
const resolvePath = require('../utils/resolvePath')

module.exports = function (plop) {
  const { views } = config

  plop.setGenerator('basePage', {
    description: '创建一个新的路由组件',
    actions: [
      {
        type: 'add',
        path: `${views}/{{name}}/index.tsx`,
        templateFile: resolvePath('../templates/basePage/index.hbs')
      },
      {
        type: 'add',
        path: `${views}/{{name}}/index.less`,
        templateFile: resolvePath('../templates/basePage/style.hbs')
      },
      {
        type: 'add',
        path: `${views}/{{name}}/interface.ts`,
        templateFile: resolvePath('../templates/basePage/interface.hbs')
      },
    ]
  })
}
