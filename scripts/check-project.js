const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  })
}

const files = walk(root).filter(
  (filePath) =>
    !filePath.includes(`${path.sep}node_modules${path.sep}`) &&
    !filePath.endsWith('project.private.config.json')
)

for (const filePath of files.filter((file) => file.endsWith('.js'))) {
  execFileSync(process.execPath, ['--check', filePath], { stdio: 'pipe' })
}

for (const filePath of files.filter((file) => file.endsWith('.json'))) {
  JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

const miniRoot = path.join(root, 'miniprogram')
const appConfig = JSON.parse(
  fs.readFileSync(path.join(miniRoot, 'app.json'), 'utf8')
)

for (const page of appConfig.pages) {
  for (const extension of ['js', 'json', 'wxml', 'wxss']) {
    const pageFile = path.join(miniRoot, `${page}.${extension}`)
    if (!fs.existsSync(pageFile)) {
      throw new Error(`缺少页面文件: ${path.relative(root, pageFile)}`)
    }
  }
}

console.log(
  `检查通过：${appConfig.pages.length} 个页面，${files.length} 个项目文件。`
)

