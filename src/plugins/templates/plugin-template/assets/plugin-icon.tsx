import React from 'react'

/**
 * 插件图标组件
 * 使用 Lucide React 图标库
 */
export const PluginIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className = "w-5 h-5", ...props }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* 插件图标 - 使用拼图块图标 */}
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

export default PluginIcon
