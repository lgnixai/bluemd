import React from 'react';
import { RSSSidebar } from './RSSSidebar';
import { RSSContent } from './RSSContent';
import { useRSSStore } from '@/stores/rss-store';

export const RSSComponent: React.FC = () => {
  const { error } = useRSSStore();

  return (
    <div className="flex h-full">
      {/* 左侧：RSS源管理侧边栏 */}
         <RSSSidebar />
     

      
    </div>
  );
};