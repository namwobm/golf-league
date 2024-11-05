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

export const Button = ({ children, className = '', ...props }) => (
  <button 
    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
)

export const Input = ({ className = '', ...props }) => (
  <input 
    className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${className}`}
    {...props}
  />
)