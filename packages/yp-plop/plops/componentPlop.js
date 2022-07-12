const config = require('../config/complexConfig')
const resolvePath = require('../utils/resolvePath')

module.exports = function (plop) {
  const { components } = config

  plop.setGenerator('component', {
    description: '创建一个新的公共组件',
    actions: [
      {
        type: 'add',
        path: `${components}/{{kebabCase name}}/index.ts`,
        templateFile: resolvePath('../templates/components/index.hbs'),
      },
      {
        type: 'add',
        path: `${components}/{{kebabCase name}}/{{kebabCase name}}.tsx`,
        templateFile: resolvePath('../templates/components/comp.hbs'),
      },
      {
        type: 'add',
        path: `${components}/{{kebabCase name}}/index.less`,
        templateFile: resolvePath('../templates/components/style.hbs'),
      },
      {
        type: 'add',
        path: `${components}/{{kebabCase name}}/interface.ts`,
        templateFile: resolvePath('../templates/components/interface.hbs')
      },
    ],
  })
}
