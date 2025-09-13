/**
 * 插件创建工具
 * 用于从模板创建新的插件
 */

import * as fs from 'fs'
import * as path from 'path'

interface PluginInfo {
  id: string
  name: string
  version: string
  description: string
  author: string
  category: string
}

/**
 * 创建新插件
 */
export async function createPlugin(pluginInfo: PluginInfo): Promise<boolean> {
  try {
    const { id, name, version, description, author, category } = pluginInfo
    
    // 验证插件ID
    if (!isValidPluginId(id)) {
      throw new Error('插件ID格式无效，只能包含字母、数字、连字符和下划线')
    }

    // 检查插件是否已存在
    const pluginPath = path.join(process.cwd(), 'src', 'plugins', id)
    if (fs.existsSync(pluginPath)) {
      throw new Error(`插件 ${id} 已存在`)
    }

    // 创建插件目录
    await createPluginDirectory(pluginPath)
    
    // 复制模板文件
    await copyTemplateFiles(pluginPath)
    
    // 更新文件内容
    await updatePluginFiles(pluginPath, pluginInfo)
    
    console.log(`✅ 插件 ${name} 创建成功！`)
    console.log(`📁 插件路径: ${pluginPath}`)
    console.log(`📝 请编辑配置文件: ${path.join(pluginPath, 'config', 'plugin.config.ts')}`)
    
    return true
  } catch (error) {
    console.error('❌ 创建插件失败:', error)
    return false
  }
}

/**
 * 验证插件ID
 */
function isValidPluginId(id: string): boolean {
  const regex = /^[a-zA-Z0-9-_]+$/
  return regex.test(id) && id.length > 0
}

/**
 * 创建插件目录结构
 */
async function createPluginDirectory(pluginPath: string): Promise<void> {
  const directories = [
    'config',
    'components',
    'hooks',
    'types',
    'assets',
    'utils',
    'styles'
  ]

  // 创建主目录
  fs.mkdirSync(pluginPath, { recursive: true })
  
  // 创建子目录
  for (const dir of directories) {
    fs.mkdirSync(path.join(pluginPath, dir), { recursive: true })
  }
}

/**
 * 复制模板文件
 */
async function copyTemplateFiles(pluginPath: string): Promise<void> {
  const templatePath = path.join(process.cwd(), 'src', 'plugins', 'templates', 'plugin-template')
  
  const files = [
    'index.ts',
    'config/plugin.config.ts',
    'components/PluginComponent.tsx',
    'hooks/usePlugin.ts',
    'types/plugin.types.ts',
    'assets/plugin-icon.tsx',
    'utils/plugin.utils.ts',
    'README.md'
  ]

  for (const file of files) {
    const sourcePath = path.join(templatePath, file)
    const targetPath = path.join(pluginPath, file)
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath)
    }
  }
}

/**
 * 更新插件文件内容
 */
async function updatePluginFiles(pluginPath: string, pluginInfo: PluginInfo): Promise<void> {
  const { id, name, version, description, author, category } = pluginInfo
  
  // 更新配置文件
  const configPath = path.join(pluginPath, 'config', 'plugin.config.ts')
  if (fs.existsSync(configPath)) {
    let content = fs.readFileSync(configPath, 'utf-8')
    
    // 替换占位符
    content = content.replace(/plugin-template/g, id)
    content = content.replace(/插件模板/g, name)
    content = content.replace(/1\.0\.0/g, version)
    content = content.replace(/这是一个插件模板，用于创建新的插件/g, description)
    content = content.replace(/Your Name/g, author)
    content = content.replace(/utility/g, category)
    
    fs.writeFileSync(configPath, content)
  }

  // 更新组件文件
  const componentPath = path.join(pluginPath, 'components', 'PluginComponent.tsx')
  if (fs.existsSync(componentPath)) {
    let content = fs.readFileSync(componentPath, 'utf-8')
    content = content.replace(/plugin-template/g, id)
    fs.writeFileSync(componentPath, content)
  }

  // 更新Hook文件
  const hookPath = path.join(pluginPath, 'hooks', 'usePlugin.ts')
  if (fs.existsSync(hookPath)) {
    let content = fs.readFileSync(hookPath, 'utf-8')
    content = content.replace(/plugin-template/g, id)
    fs.writeFileSync(hookPath, content)
  }

  // 更新README文件
  const readmePath = path.join(pluginPath, 'README.md')
  if (fs.existsSync(readmePath)) {
    let content = fs.readFileSync(readmePath, 'utf-8')
    content = content.replace(/插件模板/g, name)
    content = content.replace(/plugin-template/g, id)
    fs.writeFileSync(readmePath, content)
  }
}

/**
 * 生成插件ID建议
 */
export function generatePluginId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/-+/g, '-') // 多个连字符合并为一个
    .replace(/^-|-$/g, '') // 移除首尾连字符
}

/**
 * 获取插件分类列表
 */
export function getPluginCategories(): string[] {
  return [
    'utility',      // 工具类
    'productivity', // 生产力
    'entertainment', // 娱乐
    'education',    // 教育
    'business',     // 商业
    'development',  // 开发
    'design',       // 设计
    'communication', // 通信
    'security',     // 安全
    'other'         // 其他
  ]
}

/**
 * 验证插件信息
 */
export function validatePluginInfo(info: Partial<PluginInfo>): string[] {
  const errors: string[] = []

  if (!info.id || info.id.trim() === '') {
    errors.push('插件ID不能为空')
  } else if (!isValidPluginId(info.id)) {
    errors.push('插件ID格式无效，只能包含字母、数字、连字符和下划线')
  }

  if (!info.name || info.name.trim() === '') {
    errors.push('插件名称不能为空')
  }

  if (!info.version || info.version.trim() === '') {
    errors.push('插件版本不能为空')
  } else if (!/^\d+\.\d+\.\d+$/.test(info.version)) {
    errors.push('插件版本格式无效，应为 x.y.z 格式')
  }

  if (!info.description || info.description.trim() === '') {
    errors.push('插件描述不能为空')
  }

  if (!info.author || info.author.trim() === '') {
    errors.push('插件作者不能为空')
  }

  if (!info.category || info.category.trim() === '') {
    errors.push('插件分类不能为空')
  }

  return errors
}

export default {
  createPlugin,
  generatePluginId,
  getPluginCategories,
  validatePluginInfo
}
