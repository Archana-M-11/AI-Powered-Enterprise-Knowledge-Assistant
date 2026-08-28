import React from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    
        <nav className="topbar position-fixed top-0 start-0 w-100">
            <div className="brand">
                <div className="brand-mark">AI</div>

                <span className="brand-name">
                Enterprise Knowledge Assistant
                </span>
            </div>

      <div className="user-section">
      <span className='user-name'>Archana</span>

    <button className='logout-btn'
    onClick={handleLogout}>
      Logout
    </button>
  </div>
    </nav>
 
  )
}

export default Navbar