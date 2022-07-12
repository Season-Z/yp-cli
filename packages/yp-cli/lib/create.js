/**
 * 创建项目
 */
const fs = require('fs-extra')
const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')

const pkg = require('../package.json')
const { checkEnvironment, checkName, clearAgrv, shouldUpdate, getDepVersion } = require('yp-utils')
const Downloader = require('../utils/Downloader')
const PackageManager = require('../utils/PackageManager')
const { getTemplate, MIDDLE_WEB, NEST_JS, MINI_PROGRAM, NATIVE } = require('../config/inquirer')

/**
 * 校验项目名称，目录名称
 * @param {*} name 用户录入的项目名称
 * @param {*} options 其他配置信息
 */
async function validateName(name = '.', options) {
  clearAgrv()

  const { targetDir, projectName, isCurrentDir } = checkName(name, options)
  // 检查node环境
  await checkEnvironment(pkg)

  // 是否需要更新
  const versionPath = path.join(__dirname, '../config/version.txt')
  await shouldUpdate(pkg, versionPath)

  if (fs.existsSync(targetDir)) {
    clearAgrv()

    if (isCurrentDir) {
      const { ok } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'ok',
          message: '确认当前目录下初始化项目吗？'
        }
      ])

      if (!ok) {
        process.exit(-1)
      }
    } else {
      const { handle } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'handle',
          message: '目录已经存在，是否确认覆盖？',
        }
      ])

      if (handle) {
        await fs.remove(targetDir) // 将本地原文件删除
      } else {
        process.exit(-1)
      }
    }
  }
  clearAgrv()

  return { ...options, projectName, targetDir }
}

/**
 * 选择初始化的项目模板
 * @param {*} params 其他配置信息
 */
async function chooseTemplateType(params) {
  // 模板类型
  const { templateType } = await inquirer.prompt({
    type: 'list',
    name: 'templateType',
    message: '请选择项目模板类型',
    choices: [
      {
        value: MIDDLE_WEB,
        name: '中台'
      },
      {
        value: NEST_JS,
        name: 'nestjs'
      },
      {
        value: MINI_PROGRAM,
        name: '小程序'
      },
      {
        value: NATIVE,
        name: '客户端'
      }
    ]
  })

  // 模板名称
  const { templateName, version, description, license } = await inquirer.prompt([
    getTemplate(templateType),
    {
      type: 'input',
      name: 'version',
      message: '请输入项目的版本号',
      default: '1.0.0'
    }, {
      type: 'input',
      name: 'description',
      message: '请输入项目的描述',
      default: ''
    }, {
      type: 'choices',
      name: 'license',
      message: '请选择协议',
      default: 'MIT'
    }
  ])

  return { ...params, templateType, templateName, version, description, license }
}

/**
 * 下载模板内容
 * @param {*} params
 */
async function downloadTemplate(params) {
  const { targetDir, templateName, projectName } = params
  const downloader = new Downloader({ targetDir, templateName, projectName })

  clearAgrv()

  const url = await downloader.getSshURL()

  await downloader.run(url)

  return params
}

/**
 * 设置模板
 * @param {*} params
 */
async function templateSetting(params) {
  const { templateType, projectName, targetDir, templateName, version, description, license } = params

  // 非中台模板不再进行package.json
  if (templateType !== MIDDLE_WEB) {
    return params
  }

  const pkgPath = path.resolve(targetDir, './package.json')
  const pkgJson = await fs.readJSON(pkgPath)

  // 获取依赖的版本信息
  const ypsxVersion = getDepVersion('yp-frontend-library')
  const ypPlopVersion = getDepVersion('yp-plop')

  const pkgContent = Object.assign(pkgJson, {
    name: projectName,
    version,
    description,
    license,
    'yp-template': templateName,
    scripts: {
      ...pkgJson.scripts,
      new: 'yp-plop create',
      delete: 'yp-plop remove'
    },
    dependencies: {
      ...pkgJson.dependencies,
      'yp-frontend-library': `^${ypsxVersion}`
    },
    devDependencies: {
      ...pkgJson.devDependencies,
      'yp-plop': `^${ypPlopVersion}`
    }
  })

  console.log()
  console.log(`添加依赖 ${chalk.cyan('yp-plop')} 和 ${chalk.cyan('yp-frontend-library')}`)
  console.log(`添加配置 ${chalk.cyan('yp-template')} `)
  console.log()

  // 删除文件，创建新的package.json
  await fs.remove(path.resolve(targetDir, './.git'))
  await fs.remove(pkgPath)
  await fs.writeJSON(pkgPath, pkgContent)

  return params
}

/**
 * 安装依赖
 */
async function installDeps(params) {
  const { templateType, targetDir, projectName } = params
  const mg = new PackageManager(targetDir)

  // 进入项目目录
  mg.cdProjectPath()

  mg.install()

  mg.git()
  console.log()
  console.log(`🎉 成功生成项目：${projectName}`)
  console.log()

  if (templateType === MIDDLE_WEB) {
    console.log(`
      ${chalk.cyan('yarn start')}
        运行启动项目

      ${chalk.cyan('yarn build')}
        打包项目

      ${chalk.cyan('yarn new')} ${chalk.green('<component-name>')}
        创建页面组件/公共组件

      ${chalk.cyan('yarn remove')} ${chalk.green('<component-name>')}
        删除页面组件/公共组件
    `)
  }
}

module.exports = function (...args) {
  return validateName(...args)
    .then(chooseTemplateType)
    .then(downloadTemplate)
    .then(templateSetting)
    .then(installDeps)
    .catch((err) => {
      console.log()
      console.error(chalk.red(err))
      console.log()
      process.exit(-1)
    })
}
