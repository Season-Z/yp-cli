const MIDDLE_WEB = 'middle-web'
const NEST_JS = 'nestjs'
const MINI_PROGRAM = 'mini-program'
const NATIVE = 'native'

// 中台模板
const middleWeb = [
  {
    value: 'middle-web-simple-template',
    name: 'middle-web-simple-template（最简洁无eject）'
  },
  {
    value: 'middle-web-dva-template',
    name: 'middle-web-dva-template（以dva做数据管理）'
  },
]

const nestjs = [{
  value: 'nestjs-base-template',
  name: 'nestjs-base-template（nestjs基础模板）'
}]

function getTemplate(type) {
  let choices = []
  switch (type) {
    case MIDDLE_WEB:
      choices = middleWeb;
      break;
    case NEST_JS:
      choices = nestjs;
      break;
    default:
      throw '目前只有中台和nestjs项目模板'
  }

  return {
    type: 'list',
    name: 'templateName',
    message: '请选择项目模板',
    choices
  }
}

module.exports = {
  getTemplate,
  MIDDLE_WEB,
  NEST_JS,
  MINI_PROGRAM,
  NATIVE
}
