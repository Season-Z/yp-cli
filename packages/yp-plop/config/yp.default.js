exports.defaultConfig = {
  src: './src', // 入口目录
  components: './src/components', // 公共组件的目录
  views: './src/views', // 页面目录
  models: './src/models', // model目录
  services: './src/services', // services 目录
  router: './src/router/index.ts', // 路由文件
  menus: './src/config/menu.ts', // 菜单文件
  typings: './src/typings/index.ts', // 公共类型文件
}

// 为目录的属性
exports.directionary = ['src', 'components', 'views', 'models']

// 为文件的属性
exports.files = ['router', 'menus', 'typings']

// 模板 不必校验的文件
exports.unnecessary = {
  'middle-web-simple-template': ['typings', 'models', 'services'],
  'middle-web-dva-template': []
}
