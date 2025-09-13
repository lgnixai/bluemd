/**
 * API 服务
 * 简化版本，专注于 MVP 验证
 */

import { apiClient, ApiResponse } from './api-client'

// 健康检查响应
export interface HealthStatus {
  status: string
  version: string
}

// 项目信息响应
export interface ProjectInfo {
  name: string
  description: string
  version: string
  go_version: string
  build_time: string
  environment: string
  api: {
    version: string
    base_url: string
    endpoints: string[]
    features: string[]
  }
  links: {
    documentation: string
    health: string
    swagger: string
  }
}

// 剧集数据接口
export interface Episode {
  id: number
  movie_id: number
  episode: string
  play_url: string
  download_url?: string
  player_type?: string
  created_at: string
  updated_at: string
}

// 电影数据接口
export interface Movie {
  id: number
  vod_id: number
  name: string
  en_name?: string
  alias?: string
  cover?: string
  director?: string
  actor?: string
  area?: string
  language?: string
  year?: string
  duration?: string
  score?: string
  quality?: string
  content?: string
  update_time?: string
  total_play?: number
  category_id?: number
  category?: {
    id: number
    type_id: number
    name: string
    link: string
  }
  episodes?: Episode[]
  created_at: string
  updated_at: string
}

// 电影统计信息
export interface MovieStats {
  total_movies: number
  recent_movies: number
  total_pages: number
  last_updated: string
}

// 采集任务状态
export interface SpiderTask {
  id: number
  task_type: string
  status: string
  progress: number
  total_items: number
  processed_items: number
  error_message?: string
  created_at: string
  updated_at: string
}

/**
 * API 服务类
 */
export class ApiService {
  /**
   * 健康检查
   */
  async checkHealth(): Promise<ApiResponse<HealthStatus>> {
    return apiClient.get<HealthStatus>('/health/status')
  }

  /**
   * 获取项目信息
   */
  async getProjectInfo(): Promise<ApiResponse<ProjectInfo>> {
    return apiClient.get<ProjectInfo>('/')
  }

  /**
   * 获取电影列表
   */
  async getMovies(params?: {
    page?: number
    page_size?: number
    search?: string
    genre?: string
  }): Promise<ApiResponse<{ data: Movie[]; total: number; page: number; page_size: number; total_pages: number }>> {
    return apiClient.get('/movies', params)
  }

  /**
   * 获取电影详情
   */
  async getMovie(id: number): Promise<ApiResponse<Movie>> {
    return apiClient.get(`/movies/${id}`)
  }

  /**
   * 获取电影详情（包含剧集信息）
   */
  async getMovieWithEpisodes(id: number): Promise<ApiResponse<Movie>> {
    return apiClient.get(`/movies/${id}?include_episodes=true`)
  }

  /**
   * 获取电影统计信息
   */
  async getMovieStats(): Promise<ApiResponse<MovieStats>> {
    return apiClient.get('/spider/stats')
  }

  /**
   * 获取采集任务列表
   */
  async getSpiderTasks(): Promise<ApiResponse<{ data: SpiderTask[]; total: number; page: number; page_size: number; total_pages: number }>> {
    return apiClient.get('/spider/tasks')
  }

  /**
   * 创建采集任务
   */
  async createSpiderTask(taskType: string): Promise<ApiResponse<SpiderTask>> {
    return apiClient.post('/spider/tasks', { task_type: taskType })
  }

  /**
   * 获取采集任务详情
   */
  async getSpiderTask(id: number): Promise<ApiResponse<SpiderTask>> {
    return apiClient.get(`/spider/tasks/${id}`)
  }

  /**
   * 获取 RSS 源列表
   */
  async getRssFeeds(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/rss/feeds')
  }

  /**
   * 创建 RSS 源
   */
  async createRssFeed(feedData: {
    name: string
    url: string
    description?: string
  }): Promise<ApiResponse<any>> {
    return apiClient.post('/rss/feeds', feedData)
  }
}

// 创建默认 API 服务实例
export const apiService = new ApiService()
