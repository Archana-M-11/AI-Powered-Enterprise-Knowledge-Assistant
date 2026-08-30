import { useEffect, useState } from "react";
import { getSessions } from "../services/api";

function Sidebar({ sidebaropen, setSidebar }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getSessions();
        setSessions(response.data);
      } catch (error) {
        console.error("Failed to load sessions", error);
      }
    };

    fetchSessions();
  }, [])

  const toogleSidebar = () => {
    setSidebar((prev) => !prev);
  }
  
  return (
    <aside className={`sidebar ${sidebaropen ? "open" : "closed"}`}>
    <button
      className="sidebar-toggle"
      onClick={toogleSidebar}
    >
      ☰
    </button>
      <button className="new-chat-btn">
        + New Chat
      </button>

      <div className="chat-history">
        {sessions.map((session) => (
          <div key={session.session_id} className="chat-history-item">
            {session.session_id}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;