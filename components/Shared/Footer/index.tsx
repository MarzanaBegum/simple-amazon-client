import React from 'react'

export default function Footer() {
  return (
    <div className="flex items-center justify-center h-10 shadow-inner">
      <p>Copyright @ {new Date().getFullYear()} Amazon</p>
    </div>
  )
}
