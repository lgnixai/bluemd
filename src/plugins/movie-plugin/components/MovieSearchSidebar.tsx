import React, { useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMovieSearchStore } from '@/stores/movie-search-store';
import { apiService } from '@/lib/api-service';

const categories = [
  '全部', '电影', '电视剧', '综艺', '动漫', '纪录片', 
  '短剧', '体育', '儿童', '音乐', '戏曲', '资讯', '其他'
];

const years = [
  '全部', '2025', '2024', '2023', '2022', '2021', '2020', 
  '2019', '2018', '2017', '2016', '2015', '更早'
];

const areas = [
  '全部', '中国大陆', '香港', '台湾', '美国', '日本', '韩国', 
  '英国', '法国', '德国', '泰国', '印度', '加拿大', '西班牙', '俄罗斯', '其他'
];

const sortOptions = [
  '按更新', '周人气', '月人气'
];

export const MovieSearchSidebar: React.FC = () => {
  const { filters, setFilters, setLoading, setError, setMovies, setTotal, setCurrentPage, setTotalPages } = useMovieSearchStore();

  const searchMovies = async (searchFilters: typeof filters, page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page,
        page_size: 20
      };

      // 添加搜索参数
      if (searchFilters.keyword) params.keyword = searchFilters.keyword;
      if (searchFilters.category && searchFilters.category !== '全部') params.category = searchFilters.category;
      if (searchFilters.year && searchFilters.year !== '全部') params.year = searchFilters.year;
      if (searchFilters.area && searchFilters.area !== '全部') params.area = searchFilters.area;

      const moviesResponse = await apiService.getMovies(params);

      setMovies(moviesResponse.data.data);
      setCurrentPage(moviesResponse.data.page);
      setTotalPages(moviesResponse.data.total_pages);
      setTotal(moviesResponse.data.total);
    } catch (error) {
      setError(error instanceof Error ? error.message : '搜索失败');
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordChange = (value: string) => {
    const newFilters = { ...filters, keyword: value };
    setFilters(newFilters);
  };

  const handleFilterChange = (type: keyof Omit<typeof filters, 'keyword'>, value: string) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    // 自动搜索
    searchMovies(newFilters, 1);
  };

  const handleSearch = () => {
    searchMovies(filters, 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 监听分页事件
  useEffect(() => {
    const handleMovieSearch = (event: CustomEvent) => {
      const { filters: searchFilters, page } = event.detail;
      searchMovies(searchFilters, page);
    };

    window.addEventListener('movie-search', handleMovieSearch as EventListener);
    return () => {
      window.removeEventListener('movie-search', handleMovieSearch as EventListener);
    };
  }, []);

  const renderFilterSection = (
    title: string,
    options: string[],
    currentValue: string,
    onChange: (value: string) => void
  ) => (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <button
            key={option}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              currentValue === option
                ? 'bg-red-100 text-red-600 border border-red-200'
                : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* 关键字搜索 */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">搜索电影</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="搜索电影..."
              value={filters.keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-red-600 hover:bg-red-700 text-white px-4"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 当前筛选条件 */}
      {(filters.category !== '全部' || filters.year !== '全部' || filters.area !== '全部') && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">当前筛选</h3>
          <div className="flex flex-wrap gap-2">
            {filters.category !== '全部' && (
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                分类: {filters.category}
              </Badge>
            )}
            {filters.year !== '全部' && (
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                年份: {filters.year}
              </Badge>
            )}
            {filters.area !== '全部' && (
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                地区: {filters.area}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* 分类筛选 */}
      {renderFilterSection(
        '分类',
        categories,
        filters.category,
        (value) => handleFilterChange('category', value)
      )}

      {/* 年份筛选 */}
      {renderFilterSection(
        '年份',
        years,
        filters.year,
        (value) => handleFilterChange('year', value)
      )}

      {/* 地区筛选 */}
      {renderFilterSection(
        '地区',
        areas,
        filters.area,
        (value) => handleFilterChange('area', value)
      )}

      {/* 排序方式 */}
      {renderFilterSection(
        '排序',
        sortOptions,
        filters.sort,
        (value) => handleFilterChange('sort', value)
      )}

      {/* 清除筛选 */}
      <Button
        variant="outline"
        onClick={() => {
          const resetFilters = {
            keyword: '',
            category: '全部',
            year: '全部',
            area: '全部',
            sort: '按更新'
          };
          setFilters(resetFilters);
          searchMovies(resetFilters, 1);
        }}
        className="w-full mt-2 text-xs"
        size="sm"
      >
        <Filter className="h-3 w-3 mr-1" />
        清除筛选
      </Button>
    </div>
  );
};

export default MovieSearchSidebar;