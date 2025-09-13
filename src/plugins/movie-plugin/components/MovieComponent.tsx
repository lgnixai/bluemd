import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
// import { Separator } from '@/components/ui/separator'
import { apiService, Movie, MovieStats, SpiderTask } from '@/lib/api-service'
import { MovieIcon } from '../assets/movie-icon'

interface SearchFilters {
  keyword: string
  category: string
  year: string
  area: string
  sort: string
}

interface MovieState {
  loading: boolean
  error: string | null
  movies: Movie[]
  stats: MovieStats | null
  spiderTasks: SpiderTask[]
  currentPage: number
  totalPages: number
  searchTerm: string
  total: number
  searchFilters: SearchFilters
  showSearchInterface: boolean
}

export const MovieComponent: React.FC = () => {
  const [state, setState] = useState<MovieState>({
    loading: false,
    error: null,
    movies: [],
    stats: null,
    spiderTasks: [],
    currentPage: 1,
    totalPages: 1,
    searchTerm: '',
    total: 0,
    searchFilters: {
      keyword: '',
      category: '全部',
      year: '全部',
      area: '全部',
      sort: '按更新'
    },
    showSearchInterface: true
  })

  const loadMovies = async (page: number = 1, search?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const [moviesResponse, statsResponse, tasksResponse] = await Promise.all([
        apiService.getMovies({ page, page_size: 10, search }),
        apiService.getMovieStats(),
        apiService.getSpiderTasks()
      ])

      setState(prev => ({
        ...prev,
        loading: false,
        movies: moviesResponse.data.data,
        currentPage: moviesResponse.data.page,
        totalPages: moviesResponse.data.total_pages,
        total: moviesResponse.data.total,
        stats: statsResponse.data,
        spiderTasks: tasksResponse.data.data
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '加载失败'
      }))
    }
  }

  const searchMovies = async (filters: SearchFilters, page: number = 1) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const params: any = {
        page,
        page_size: 20
      }

      // 添加搜索参数
      if (filters.keyword) params.keyword = filters.keyword
      if (filters.category && filters.category !== '全部') params.category = filters.category
      if (filters.year && filters.year !== '全部') params.year = filters.year
      if (filters.area && filters.area !== '全部') params.area = filters.area

      const moviesResponse = await apiService.getMovies(params)

      setState(prev => ({
        ...prev,
        loading: false,
        movies: moviesResponse.data.data,
        currentPage: moviesResponse.data.page,
        totalPages: moviesResponse.data.total_pages,
        total: moviesResponse.data.total,
        searchFilters: filters
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '搜索失败'
      }))
    }
  }


  const createSpiderTask = async (taskType: string) => {
    try {
      await apiService.createSpiderTask(taskType)
      // 重新加载数据
      loadMovies(state.currentPage, state.searchFilters.keyword)
    } catch (error) {
      console.error('创建采集任务失败:', error)
    }
  }


  const getTaskStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">已完成</Badge>
      case 'running':
        return <Badge variant="default" className="bg-blue-500">运行中</Badge>
      case 'failed':
        return <Badge variant="destructive">失败</Badge>
      case 'pending':
        return <Badge variant="secondary">等待中</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 组件挂载时加载数据
  useEffect(() => {
    if (state.showSearchInterface) {
      // 如果显示搜索界面，加载初始搜索数据
      searchMovies(state.searchFilters, 1)
    } else {
      // 否则加载传统的数据
      loadMovies()
    }
  }, [])

  // 不再显示搜索界面，而是显示传统的插件信息

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MovieIcon className="w-6 h-6" />
          <h1 className="text-2xl font-bold">电影数据</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => createSpiderTask('recent')}
            variant="outline"
            size="sm"
          >
            增量更新
          </Button>
          <Button 
            onClick={() => createSpiderTask('full')}
            variant="outline"
            size="sm"
          >
            全量采集
          </Button>
        </div>
      </div>

      {state.error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">加载错误</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{state.error}</p>
          </CardContent>
        </Card>
      )}

      {/* 统计信息 */}
      {state.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">总电影数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{state.stats.total_movies}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">最近更新</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{state.stats.recent_movies}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">总页数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{state.stats.total_pages}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">最后更新</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                {new Date(state.stats.last_updated).toLocaleDateString('zh-CN')}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 搜索 */}
      <Card>
        <CardHeader>
          <CardTitle>搜索电影</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="输入电影名称搜索..."
            value={state.searchTerm}
            onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      {/* 采集任务状态 */}
      {state.spiderTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>采集任务</CardTitle>
            <CardDescription>最近的采集任务状态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {state.spiderTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">任务 #{task.id}</span>
                      {getTaskStatusBadge(task.status)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>类型: {task.task_type}</span>
                      <span className="mx-2">•</span>
                      <span>进度: {task.processed_items}/{task.total_items}</span>
                    </div>
                    {task.error_message && (
                      <div className="text-sm text-red-600 mt-1">
                        错误: {task.error_message}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(task.created_at).toLocaleString('zh-CN')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 电影列表 */}
      <Card>
        <CardHeader>
          <CardTitle>电影列表</CardTitle>
          <CardDescription>
            第 {state.currentPage} 页，共 {state.totalPages} 页
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : state.movies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无电影数据
            </div>
          ) : (
            <div className="space-y-4">
              {state.movies.map((movie) => (
                <div key={movie.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center">
                    {movie.cover ? (
                      <img 
                        src={movie.cover} 
                        alt={movie.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <MovieIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{movie.name}</h3>
                    {movie.content && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {movie.content}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      {movie.category?.name && <span>类型: {movie.category.name}</span>}
                      {movie.director && <span>导演: {movie.director}</span>}
                      {movie.score && <span>评分: {movie.score}</span>}
                      {movie.year && <span>年份: {movie.year}</span>}
                      {movie.area && <span>地区: {movie.area}</span>}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      创建时间: {new Date(movie.created_at).toLocaleString('zh-CN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 分页 */}
          {state.totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={state.currentPage === 1}
                onClick={() => loadMovies(state.currentPage - 1, state.searchFilters.keyword)}
              >
                上一页
              </Button>
              <span className="px-4 py-2 text-sm">
                {state.currentPage} / {state.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={state.currentPage === state.totalPages}
                onClick={() => loadMovies(state.currentPage + 1, state.searchFilters.keyword)}
              >
                下一页
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
