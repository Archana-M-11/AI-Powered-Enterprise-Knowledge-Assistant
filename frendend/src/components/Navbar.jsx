import React from 'react'

const Navbar = () => {
  return (
        <nav className='topbar'>
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