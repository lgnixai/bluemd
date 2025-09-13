import React, { useState } from 'react';
import { Play, Star, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Movie } from '@/lib/api-service';
import { MoviePlayerModal } from './MoviePlayerModal';

interface MovieSearchResultsProps {
  movies: Movie[];
  loading: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onMovieClick: (movie: Movie) => void;
}

export const MovieSearchResults: React.FC<MovieSearchResultsProps> = ({
  movies,
  loading,
  total,
  currentPage,
  totalPages,
  onPageChange,
  onMovieClick
}) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsPlayerOpen(true);
    onMovieClick(movie);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedMovie(null);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">搜索中...</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🎬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关电影</h3>
          <p className="text-gray-600">请尝试其他搜索条件</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* 搜索结果统计 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          搜索结果
          <span className="text-sm font-normal text-gray-600 ml-2">
            (共找到 {total.toLocaleString()} 部电影)
          </span>
        </h2>
      </div>

      {/* 电影网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mb-8">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group cursor-pointer"
            onClick={() => handleMovieClick(movie)}
          >
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-3">
              {movie.cover ? (
                <img
                  src={movie.cover}
                  alt={movie.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎬</div>
                    <div className="text-sm">暂无封面</div>
                  </div>
                </div>
              )}
              
              {/* 播放按钮 */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMovieClick(movie);
                  }}
                >
                  <Play className="h-5 w-5 ml-1" />
                </Button>
            <Button
              size="sm"
              className="opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 p-0"
              onClick={(e) => {
                e.stopPropagation();
                // 直接在新标签页打开，不设置窗口大小限制
                window.open(`/src/pages/video-player.html?movieId=${movie.id}`, '_blank');
              }}
              title="在新标签页播放"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
              </div>

              {/* 评分标签 */}
              {movie.score && movie.score > 0 && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    {movie.score}
                  </Badge>
                </div>
              )}
            </div>

            {/* 电影信息 */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                {movie.name}
              </h3>
              
              {movie.en_name && (
                <p className="text-sm text-gray-500 line-clamp-1">
                  {movie.en_name}
                </p>
              )}

              <div className="flex items-center space-x-4 text-xs text-gray-500">
                {movie.year && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {typeof movie.year === 'string' ? movie.year : movie.year.toString()}
                  </div>
                )}
                {movie.area && (
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {movie.area}
                  </div>
                )}
              </div>

              {movie.category && (
                <Badge variant="outline" className="text-xs">
                  {movie.category.name}
                </Badge>
              )}

              {movie.director && (
                <p className="text-xs text-gray-500 line-clamp-1">
                  导演: {movie.director}
                </p>
              )}

              {movie.actors && (
                <p className="text-xs text-gray-500 line-clamp-1">
                  主演: {movie.actors}
                </p>
              )}

              {movie.update_time && (
                <p className="text-xs text-gray-400">
                  更新: {new Date(movie.update_time).toLocaleDateString('zh-CN')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            上一页
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={currentPage === page ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  {page}
                </Button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="text-gray-500">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            下一页
          </Button>
        </div>
      )}

      {/* 视频播放弹窗 */}
      <MoviePlayerModal
        movie={selectedMovie}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
      />
    </div>
  );
};

export default MovieSearchResults;
