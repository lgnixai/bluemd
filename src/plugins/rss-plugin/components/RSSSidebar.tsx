import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRSSStore, RSSFeed } from '@/stores/rss-store';

export const RSSSidebar: React.FC = () => {
  const { 
    feeds, 
    selectedFeed, 
    loading, 
    setFeeds, 
    setSelectedFeed, 
    setLoading, 
    setError,
    addFeed,
    removeFeed
  } = useRSSStore();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState('');

  // 获取RSS源列表
  const fetchFeeds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:6066/v1/rss/feeds');
      if (response.ok) {
        const data = await response.json();
        setFeeds(data.data?.items || []);
      } else {
        setError('获取RSS源失败');
      }
    } catch (error) {
      setError('获取RSS源失败');
    } finally {
      setLoading(false);
    }
  };

  // 添加RSS源
  const handleAddFeed = async () => {
    if (!newFeedUrl.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:6066/v1/rss/feeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFeedUrl,
          url: newFeedUrl,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        addFeed(data.data);
        setNewFeedUrl('');
        setShowAddDialog(false);
      } else {
        setError('添加RSS源失败');
      }
    } catch (error) {
      setError('添加RSS源失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除RSS源
  const handleDeleteFeed = async (feedId: number) => {
    if (!confirm('确定要删除这个RSS源吗？')) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:6066/v1/rss/feeds/${feedId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        removeFeed(feedId);
      } else {
        setError('删除RSS源失败');
      }
    } catch (error) {
      setError('删除RSS源失败');
    } finally {
      setLoading(false);
    }
  };

  // 刷新RSS源
  const handleRefreshFeed = async (feedId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:6066/v1/rss/feeds/${feedId}/fetch`, {
        method: 'POST',
      });
      
      if (response.ok) {
        // 刷新成功后重新获取源列表
        fetchFeeds();
      } else {
        setError('刷新RSS源失败');
      }
    } catch (error) {
      setError('刷新RSS源失败');
    } finally {
      setLoading(false);
    }
  };

  // 选择RSS源
  const handleSelectFeed = (feed: RSSFeed) => {
    setSelectedFeed(feed);
  };

  // 初始化加载RSS源
  useEffect(() => {
    fetchFeeds();
  }, []);

  return (
    <div className="space-y-4">
      {/* 头部操作区 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">RSS源管理</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={fetchFeeds}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            size="sm"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* RSS源列表 */}
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedFeed?.id === feed.id 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => handleSelectFeed(feed)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{feed.name}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {feed.description || feed.url}
                </p>
                {feed.item_count && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {feed.item_count} 篇文章
                  </Badge>
                )}
              </div>
              <div className="flex gap-1 ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRefreshFeed(feed.id);
                  }}
                  disabled={loading}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFeed(feed.id);
                  }}
                  disabled={loading}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {feeds.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">📰</div>
            <p className="text-sm text-gray-500">暂无RSS源</p>
            <p className="text-xs text-gray-400 mt-1">点击"+"按钮添加RSS源</p>
          </div>
        )}
      </div>

      {/* 添加RSS源对话框 */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">添加RSS源</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RSS源URL
                </label>
                <Input
                  type="text"
                  value={newFeedUrl}
                  onChange={(e) => setNewFeedUrl(e.target.value)}
                  placeholder="请输入RSS源URL"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  取消
                </Button>
                <Button
                  onClick={handleAddFeed}
                  disabled={loading}
                >
                  添加
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
