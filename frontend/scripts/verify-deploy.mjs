import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const root = path.resolve(frontendRoot, '..')

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') {
      return []
    }
    const fullPath = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  })
}

const yamlFiles = walk(root).filter((file) => /\.ya?ml$/.test(file))
for (const file of yamlFiles) {
  const parsed = parse(fs.readFileSync(file, 'utf8'))
  if (!parsed) {
    throw new Error(`YAML 文件内容为空: ${path.relative(root, file)}`)
  }
}

console.log(`部署配置检查通过：${yamlFiles.length} 个 YAML 文件。`)
