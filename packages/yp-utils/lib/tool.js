const { execSync } = require('child_process')

// 是否支持yarn、cnpm
const ENV_CONFIG = {
  hasYarn: null,
  hasCnpm: null,
  hasGit: null
}

function exitBin(name) {
  const binName = `has${name[0].toUpperCase() + name.slice(1)}` // 拼接完整的名称

  // 命令存在则返回
  if (ENV_CONFIG[binName] !== null) {
    return ENV_CONFIG[binName]
  }

  try {
    execSync(`${name} --version`, { stdio: 'ignore' })
    // eslint-disable-next-line no-return-assign
    return (ENV_CONFIG[binName] = true)
  } catch (error) {
    // eslint-disable-next-line no-return-assign
    return (ENV_CONFIG[binName] = false)
  }
}

const hasYarn = exitBin.bind(this, 'yarn')
const hasCnpm = exitBin.bind(this, 'cnpm')
const hasGit = exitBin.bind(this, 'git')

function getCommad() {
  if (hasYarn()) {
    return 'yarn'
  }
  if (hasCnpm()) {
    return 'cnpm'
  }
  return 'npm'
}

module.exports = {
  hasYarn,
  hasCnpm,
  hasGit,
  bin: getCommad()
}
