const config = require('../config/complexConfig')
const resolvePath = require('../utils/resolvePath')

module.exports = function (plop) {
  const { models, services, views } = config

  plop.setGenerator('dvaPage', {
    description: '创建一个新的dva路由组件',
    actions: (data) => {
      const { name, modalName, needModel } = data

      const pageArr = [
        {
          type: 'add',
          path: `${views}/${name}/index.tsx`,
          templateFile: resolvePath('../templates/basePage/index.hbs')
        },
        {
          type: 'add',
          path: `${views}/${name}/index.less`,
          templateFile: resolvePath('../templates/basePage/style.hbs')
        },
        {
          type: 'add',
          path: `${views}/${name}/interface.ts`,
          templateFile: resolvePath('../templates/basePage/interface.hbs')
        },
      ]
      const modelArr = [
        {
          type: 'add',
          path: `${models}/${modalName}.ts`,
          templateFile: resolvePath('../templates/model/model.hbs')
        },
        {
          type: 'add',
          path: `${services}/${modalName}.ts`,
          templateFile: resolvePath('../templates/model/service.hbs')
        },
      ]

      if (needModel) {
        return pageArr.concat(modelArr)
      }
      return pageArr
    }
  })
}
