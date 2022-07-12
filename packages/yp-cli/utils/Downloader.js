const downloadHandler = require('download-git-repo')
const ora = require('ora')
const chalk = require('chalk')
const request = require('./request')

class Downloader {
  constructor(props) {
    /**
     * targetDir： 用户录入的项目名称，输出的文件地址
     * templateName：模板代码的项目名称
     * projectName：用户自定义的目录
     */
    const { targetDir, templateName, projectName } = props

    this.targetDir = targetDir
    this.templateName = templateName
    this.projectName = projectName

    // 缓存目录
    // this.dest = path.resolve(cacheDir, this.templateName)
  }

  // checkCache() {
  //   return fs.existsSync(this.dest)
  // }

  // 查询模板列表
  async getSshURL() {
    const spinner = ora('正在检测项目...')
    spinner.start()

    const list = await request(`/search?search=${this.templateName}&scope=projects`)
    const { ssh_url_to_repo } = list.find((v) => v.name === this.templateName) || {}

    if (!ssh_url_to_repo) {
      spinner.fail(chalk.red('🤔 居然找不到该模板!'))
      process.exit(1)
    }
    spinner.succeed(chalk.green('🥳 检测成功!'))

    return ssh_url_to_repo
  }

  async run(url) {
    // if (this.checkCache()) {
    //   // 将缓存内容拷贝出来
    //   await fs.copy(this.dest, this.targetDir)
    // } else {
    await this.handleDownload(url)
    // }
  }

  handleDownload(url) {
    return new Promise((resolve, reject) => {
      const spinner = ora(`开始下载模板：${chalk.yellow(this.templateName)}`)
      spinner.start()

      downloadHandler(`direct:${url}`, this.targetDir, { clone: true }, (err) => {
        if (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(`拉取代码失败：, ${err}`)
        }
        spinner.succeed(`成功下载模板：${chalk.yellow(this.templateName)}`)

        // 拷贝文件至缓存目录
        // fs.copy(this.targetDir, this.dest)
        resolve()
      })
    })
  }
}

module.exports = Downloader
