import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { createPlugin, generatePluginId, getPluginCategories, validatePluginInfo } from './create-plugin'

/**
 * 插件创建向导组件
 */
export const PluginWizard: React.FC = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  
  const [pluginInfo, setPluginInfo] = useState({
    id: '',
    name: '',
    version: '1.0.0',
    description: '',
    author: '',
    category: ''
  })

  // 处理输入变化
  const handleInputChange = (field: string, value: string) => {
    setPluginInfo(prev => ({ ...prev, [field]: value }))
    
    // 自动生成插件ID
    if (field === 'name' && value) {
      const generatedId = generatePluginId(value)
      setPluginInfo(prev => ({ ...prev, id: generatedId }))
    }
    
    // 清除错误
    if (errors.length > 0) {
      setErrors([])
    }
  }

  // 验证当前步骤
  const validateStep = (): boolean => {
    const validationErrors = validatePluginInfo(pluginInfo)
    setErrors(validationErrors)
    return validationErrors.length === 0
  }

  // 下一步
  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1)
    }
  }

  // 上一步
  const prevStep = () => {
    setStep(prev => prev - 1)
  }

  // 创建插件
  const handleCreatePlugin = async () => {
    if (!validateStep()) return
    
    setLoading(true)
    try {
      const success = await createPlugin(pluginInfo)
      if (success) {
        setSuccess(true)
      } else {
        setErrors(['创建插件失败，请检查控制台错误信息'])
      }
    } catch (error) {
      setErrors([error instanceof Error ? error.message : '创建插件时发生未知错误'])
    } finally {
      setLoading(false)
    }
  }

  // 重置向导
  const resetWizard = () => {
    setStep(1)
    setPluginInfo({
      id: '',
      name: '',
      version: '1.0.0',
      description: '',
      author: '',
      category: ''
    })
    setErrors([])
    setSuccess(false)
  }

  if (success) {
    return (
      <div className="plugin-wizard p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">插件创建成功！</h2>
            <p className="text-muted-foreground mb-6">
              您的插件 <strong>{pluginInfo.name}</strong> 已成功创建
            </p>
            <div className="space-y-2 text-sm text-left bg-muted p-4 rounded-lg mb-6">
              <div><strong>插件ID:</strong> {pluginInfo.id}</div>
              <div><strong>插件名称:</strong> {pluginInfo.name}</div>
              <div><strong>版本:</strong> {pluginInfo.version}</div>
              <div><strong>分类:</strong> {pluginInfo.category}</div>
              <div><strong>作者:</strong> {pluginInfo.author}</div>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={resetWizard}>
                创建新插件
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                返回插件管理器
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="plugin-wizard p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>创建新插件</CardTitle>
          <CardDescription>
            使用向导快速创建您的插件
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 步骤指示器 */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    step > stepNumber ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* 错误提示 */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* 步骤内容 */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">基本信息</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">插件名称 *</Label>
                  <Input
                    id="name"
                    placeholder="输入插件名称"
                    value={pluginInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="id">插件ID *</Label>
                  <Input
                    id="id"
                    placeholder="插件唯一标识符"
                    value={pluginInfo.id}
                    onChange={(e) => handleInputChange('id', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    只能包含字母、数字、连字符和下划线
                  </p>
                </div>
                <div>
                  <Label htmlFor="version">版本号 *</Label>
                  <Input
                    id="version"
                    placeholder="1.0.0"
                    value={pluginInfo.version}
                    onChange={(e) => handleInputChange('version', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    使用语义化版本号 (x.y.z)
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">详细信息</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">插件描述 *</Label>
                  <Textarea
                    id="description"
                    placeholder="描述您的插件功能"
                    value={pluginInfo.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="author">作者 *</Label>
                  <Input
                    id="author"
                    placeholder="您的姓名或组织"
                    value={pluginInfo.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="category">插件分类 *</Label>
                  <Select value={pluginInfo.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择插件分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {getPluginCategories().map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">确认信息</h3>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">插件名称:</span>
                    <span>{pluginInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">插件ID:</span>
                    <Badge variant="outline">{pluginInfo.id}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">版本:</span>
                    <span>{pluginInfo.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">作者:</span>
                    <span>{pluginInfo.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">分类:</span>
                    <Badge variant="secondary">{pluginInfo.category}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">描述:</span>
                    <span className="text-right max-w-xs">{pluginInfo.description}</span>
                  </div>
                </div>
                <Alert>
                  <AlertDescription>
                    确认信息无误后，点击"创建插件"按钮。插件将在 <code>src/plugins/{pluginInfo.id}/</code> 目录下创建。
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
            >
              上一步
            </Button>
            
            {step < 3 ? (
              <Button onClick={nextStep}>
                下一步
              </Button>
            ) : (
              <Button onClick={handleCreatePlugin} disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                创建插件
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PluginWizard
