import { create } from 'zustand'
import { Movie } from '@/lib/api-service'

interface SearchFilters {
  keyword: string
  category: string
  year: string
  area: string
  sort: string
}

interface MovieSearchState {
  // 搜索状态
  filters: SearchFilters
  movies: Movie[]
  loading: boolean
  error: string | null
  total: number
  currentPage: number
  totalPages: number
  
  // 操作方法
  setFilters: (filters: SearchFilters) => void
  setMovies: (movies: Movie[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setTotal: (total: number) => void
  setCurrentPage: (page: number) => void
  setTotalPages: (pages: number) => void
  reset: () => void
}

const initialFilters: SearchFilters = {
  keyword: '',
  category: '全部',
  year: '全部',
  area: '全部',
  sort: '按更新'
}

export const useMovieSearchStore = create<MovieSearchState>((set) => ({
  // 初始状态
  filters: initialFilters,
  movies: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  totalPages: 0,
  
  // 操作方法
  setFilters: (filters) => set({ filters }),
  setMovies: (movies) => set({ movies }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setTotal: (total) => set({ total }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setTotalPages: (totalPages) => set({ totalPages }),
  reset: () => set({
    filters: initialFilters,
    movies: [],
    loading: false,
    error: null,
    total: 0,
    currentPage: 1,
    totalPages: 0
  })
}))
