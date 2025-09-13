import React from 'react'

export const HealthIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ 
  className = "w-5 h-5", 
  ...props 
}) => {
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
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

