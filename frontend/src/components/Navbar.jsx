import React from 'react'

const Navbar = () => {
  return (
    
        <nav className="topbar position-fixed top-0 start-0 w-100">
            <div className="brand">
                <div className="brand-mark">AI</div>

                <span className="brand-name">
                Enterprise Knowledge Assistant
                </span>
            </div>
      <div className="corpus-status">
        <span className="dot"></span>
        Knowledge Base Ready
      </div>
    </nav>
 
  )
}

export default Navbar