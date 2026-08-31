import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import {getCurrentUser} from '../services/api'

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [darktheme, setDarkmode] = useState(() => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme !== "light";
});

  const handleLogout = () => {
  const confirmed = window.confirm("Are you sure you want to logout?");
  if (confirmed) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
    }
  };

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

  useEffect(() => {
  const loadUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  loadUser();
}, []);

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

      <div className="user-avatar">
        {user?.name?.charAt(0).toUpperCase()}
      </div>
      <span className="user-name">{user?.name}</span>
   

    <button className='logout-btn'
    onClick={handleLogout}>
      Logout
    </button>
  </div>
    </nav>
  )
}

export default Navbar