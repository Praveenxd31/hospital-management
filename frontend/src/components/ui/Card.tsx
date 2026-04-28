import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  actions?: ReactNode
}

export const Card = ({ children, className = '', title, actions }: CardProps) => {
  return (
    <div className={`card bg-base-100 shadow-sm border border-base-200 ${className}`}>
      <div className="card-body">
        {(title || actions) && (
          <div className="flex items-center justify-between mb-2">
            {title && <h2 className="card-title text-lg">{title}</h2>}
            {actions && <div>{actions}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}