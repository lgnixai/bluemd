import React from 'react';
import { RSSSidebar } from './RSSSidebar';
import { RSSContent } from './RSSContent';
import { useRSSStore } from '@/stores/rss-store';

export const RSSComponent: React.FC = () => {
  const { error } = useRSSStore();

  return (
    <div className="flex h-full">
      {/* 左侧：RSS源管理侧边栏 */}
      <div className="w-1/3 border-r bg-background p-4">
        <RSSSidebar />
      </div>

      {/* 右侧：文章内容区域 */}
      <div className="flex-1 p-4">
        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <RSSContent />
      </div>
    </div>
  );
};