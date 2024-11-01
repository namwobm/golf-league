'use client'

import React from 'react'

export function Button({ className = '', children, ...props }) {
  return (
    <button
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button