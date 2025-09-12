import React from 'react';
import { Plugin } from '@/types/plugin';
import { PluginContentContainer } from '@/components/plugin-sidebar';

// 图标组件
const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14,2 14,8 20,8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10,9 9,9 8,9"></polyline>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

// 设置插件内容组件
const SettingsPluginContent: React.FC<any> = ({ plugin, active, onClose }) => {
  return (
    <PluginContentContainer plugin={plugin} active={active} onClose={onClose}>
      <div className="settings-content">
        <h4>应用设置</h4>
        <div className="settings-section">
          <label>
            <input type="checkbox" defaultChecked />
            启用通知
          </label>
        </div>
        <div className="settings-section">
          <label>
            <input type="checkbox" />
            深色模式
          </label>
        </div>
        <div className="settings-section">
          <label>
            语言设置
            <select defaultValue="zh-CN">
              <option value="zh-CN">中文</option>
              <option value="en-US">English</option>
            </select>
          </label>
        </div>
      </div>
    </PluginContentContainer>
  );
};

// 文件管理插件内容组件
const FileManagerPluginContent: React.FC<any> = ({ plugin, active, onClose }) => {
  return (
    <PluginContentContainer plugin={plugin} active={active} onClose={onClose}>
      <div className="file-manager-content">
        <h4>文件管理</h4>
        <div className="file-list">
          <div className="file-item">
            <FileIcon />
            <span>文档.docx</span>
          </div>
          <div className="file-item">
            <FileIcon />
            <span>表格.xlsx</span>
          </div>
          <div className="file-item">
            <FileIcon />
            <span>演示.pptx</span>
          </div>
        </div>
        <button className="upload-btn">上传文件</button>
      </div>
    </PluginContentContainer>
  );
};

// 搜索插件内容组件
const SearchPluginContent: React.FC<any> = ({ plugin, active, onClose }) => {
  return (
    <PluginContentContainer plugin={plugin} active={active} onClose={onClose}>
      <div className="search-content">
        <h4>全局搜索</h4>
        <div className="search-box">
          <input type="text" placeholder="搜索..." />
          <button>搜索</button>
        </div>
        <div className="search-results">
          <p>最近搜索：</p>
          <ul>
            <li>项目文档</li>
            <li>用户管理</li>
            <li>系统设置</li>
          </ul>
        </div>
      </div>
    </PluginContentContainer>
  );
};

// 日历插件内容组件
const CalendarPluginContent: React.FC<any> = ({ plugin, active, onClose }) => {
  return (
    <PluginContentContainer plugin={plugin} active={active} onClose={onClose}>
      <div className="calendar-content">
        <h4>日历</h4>
        <div className="calendar-widget">
          <div className="calendar-header">
            <button>‹</button>
            <span>2024年1月</span>
            <button>›</button>
          </div>
          <div className="calendar-grid">
            <div className="calendar-day">1</div>
            <div className="calendar-day">2</div>
            <div className="calendar-day">3</div>
            <div className="calendar-day">4</div>
            <div className="calendar-day">5</div>
            <div className="calendar-day">6</div>
            <div className="calendar-day">7</div>
          </div>
        </div>
        <div className="calendar-events">
          <h5>今日事件</h5>
          <div className="event-item">
            <span>10:00</span>
            <span>团队会议</span>
          </div>
        </div>
      </div>
    </PluginContentContainer>
  );
};

// 示例插件定义
export const samplePlugins: Plugin[] = [
  {
    id: 'settings',
    name: '设置',
    description: '应用设置和配置',
    version: '1.0.0',
    author: 'System',
    icon: <SettingsIcon />,
    installed: false,
    enabled: false,
    config: {
      position: 1,
      showInNav: true
    },
    content: SettingsPluginContent
  },
  {
    id: 'file-manager',
    name: '文件管理',
    description: '文件上传和管理',
    version: '1.0.0',
    author: 'System',
    icon: <FileIcon />,
    installed: false,
    enabled: false,
    config: {
      position: 2,
      showInNav: true
    },
    content: FileManagerPluginContent
  },
  {
    id: 'search',
    name: '搜索',
    description: '全局搜索功能',
    version: '1.0.0',
    author: 'System',
    icon: <SearchIcon />,
    installed: false,
    enabled: false,
    config: {
      position: 3,
      showInNav: true
    },
    content: SearchPluginContent
  },
  {
    id: 'calendar',
    name: '日历',
    description: '日历和事件管理',
    version: '1.0.0',
    author: 'System',
    icon: <CalendarIcon />,
    installed: false,
    enabled: false,
    config: {
      position: 4,
      showInNav: true
    },
    content: CalendarPluginContent
  }
];
