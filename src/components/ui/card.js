'use client'

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>
)

export const CardHeader = ({ children }) => (
  <div className="p-6">{children}</div>
)

export const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-bold text-black">{children}</h2>
)

export const CardContent = ({ children }) => (
  <div className="p-6 pt-0">{children}</div>
)