import React from 'react';
import { Settings, FileText, Search, Calendar } from 'lucide-react';
import { Plugin } from '../types/plugin';
import { PluginContentContainer } from '../components/plugin-sidebar';

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
            <FileText className="size-4" />
            <span>文档.docx</span>
          </div>
          <div className="file-item">
            <FileText className="size-4" />
            <span>表格.xlsx</span>
          </div>
          <div className="file-item">
            <FileText className="size-4" />
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
    icon: Settings,
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
    icon: FileText,
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
    icon: Search,
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
    icon: Calendar,
    installed: false,
    enabled: false,
    config: {
      position: 4,
      showInNav: true
    },
    content: CalendarPluginContent
  }
];
