import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/api';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [darktheme, setDarkmode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme !== "light";
  });

  const confirmLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.success("Logged out successfully");
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  useEffect(() => {
    document.body.classList.toggle("light-theme", !darktheme);
    localStorage.setItem("theme", darktheme ? "dark" : "light");
  }, [darktheme]);

  const toggleTheme = () => {
    setDarkmode((prev) => !prev);
  };

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
    <>
      <nav className="topbar position-fixed top-0 start-0 w-100">
        <div className="brand">
          <div className="brand-mark">AI</div>
          <span className="brand-name">Enterprise Knowledge Assistant</span>
        </div>

        <div className="user-section">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme"></button>

          <div className="user-section info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{user?.name}</span>
          </div>

          <button className="logout-btn" onClick={() => setShowLogoutConfirm(true)}>
            Logout
          </button>
        </div>
      </nav>

      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Log out?</h3>
            <p>You'll need to sign in again to continue.</p>
            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
              <button className="modal-btn-primary" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;