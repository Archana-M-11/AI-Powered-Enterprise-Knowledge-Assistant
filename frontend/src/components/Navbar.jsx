import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
 const [darktheme, setDarkmode] = useState(() => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme !== "light";
});

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  }
  useEffect(() => {
  document.body.classList.toggle("light-theme", !darktheme);

  localStorage.setItem(
    "theme",
    darktheme ? "dark" : "light"
  );
}, [darktheme]);

  const toggleTheme = () => {
   setDarkmode((prev)=>!prev)
  }

  return (
    
        <nav className="topbar position-fixed top-0 start-0 w-100">
            <div className="brand">
                <div className="brand-mark">AI</div>

                <span className="brand-name">
                Enterprise Knowledge Assistant
                </span>
            </div>
    
      <div className="user-section">

          <button className="theme-toggle" onClick={toggleTheme}>
            {darktheme? "☀️" : "🌙" }
          </button>

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