/**
 * 缓存数据
 */
const fs = require('fs-extra')

const dirname = process.platform === 'win32' ? 'USERPROFILE' : 'HOME'
// 缓存目录
const cacheDir = `${process.env[dirname]}/yp-cli`

/**
 * 生成缓存文件
 */
async function generateCacheFile(filename, string) {
  if (!fs.existsSync(cacheDir)) {
    await fs.mkdir(cacheDir)
  }

  await fs.writeFile(`${cacheDir}/${filename}.ts`, string)
}

/**
 * 清空缓存文件
 */
async function clearCacheFile() {
  await fs.emptyDir(cacheDir)
}

module.exports = {
  generateCacheFile,
  clearCacheFile,
  cacheDir
}
