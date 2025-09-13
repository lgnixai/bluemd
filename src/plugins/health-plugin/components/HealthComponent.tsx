import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { apiService, ProjectInfo, HealthStatus } from '@/lib/api-service'
import { HealthIcon } from '../assets/health-icon'

interface HealthState {
  loading: boolean
  error: string | null
  healthStatus: HealthStatus | null
  projectInfo: ProjectInfo | null
  lastCheck: Date | null
}

export const HealthComponent: React.FC = () => {
  const [state, setState] = useState<HealthState>({
    loading: false,
    error: null,
    healthStatus: null,
    projectInfo: null,
    lastCheck: null
  })

  const checkHealth = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // 并行检查健康状态和项目信息
      const [healthResponse, projectResponse] = await Promise.all([
        apiService.checkHealth(),
        apiService.getProjectInfo()
      ])

      setState(prev => ({
        ...prev,
        loading: false,
        healthStatus: healthResponse.data,
        projectInfo: projectResponse.data,
        lastCheck: new Date()
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '检查失败'
      }))
    }
  }

  // 组件挂载时自动检查
  useEffect(() => {
    checkHealth()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ok':
        return <Badge variant="default" className="bg-green-500">正常</Badge>
      case 'error':
        return <Badge variant="destructive">错误</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HealthIcon className="w-6 h-6" />
          <h1 className="text-2xl font-bold">健康检查</h1>
        </div>
        <Button 
          onClick={checkHealth} 
          disabled={state.loading}
          variant="outline"
        >
          {state.loading ? '检查中...' : '重新检查'}
        </Button>
      </div>

      {state.error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">连接错误</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{state.error}</p>
            <p className="text-sm text-red-500 mt-2">
              请确保后端服务正在运行在 http://localhost:6066
            </p>
          </CardContent>
        </Card>
      )}

      {state.healthStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              服务状态
              {getStatusBadge(state.healthStatus.status)}
            </CardTitle>
            <CardDescription>
              后端 API 服务健康状态
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">状态</p>
                <p className="text-lg">{state.healthStatus.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">版本</p>
                <p className="text-lg">{state.healthStatus.version}</p>
              </div>
            </div>
            {state.lastCheck && (
              <div>
                <p className="text-sm font-medium text-gray-500">最后检查时间</p>
                <p className="text-sm text-gray-600">
                  {state.lastCheck.toLocaleString('zh-CN')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {state.projectInfo && (
        <Card>
          <CardHeader>
            <CardTitle>项目信息</CardTitle>
            <CardDescription>
              后端服务项目详情
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">项目名称</p>
                <p className="text-lg font-semibold">{state.projectInfo.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">版本</p>
                <p className="text-lg">{state.projectInfo.version}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Go 版本</p>
                <p className="text-lg">{state.projectInfo.go_version}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">环境</p>
                <p className="text-lg">{state.projectInfo.environment}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">项目描述</p>
              <p className="text-sm text-gray-600">{state.projectInfo.description}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">API 功能</p>
              <div className="flex flex-wrap gap-2">
                {state.projectInfo.api.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">快速链接</p>
              <div className="flex space-x-4">
                <a 
                  href={`${state.projectInfo.links.swagger}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  API 文档
                </a>
                <a 
                  href={`${state.projectInfo.links.health}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  健康检查
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

