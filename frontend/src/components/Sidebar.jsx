import { useEffect, useState } from "react";
import { getSessions,createSession } from "../services/api";
import { useNavigate } from "react-router-dom";


function Sidebar({ sidebaropen, setSidebar }) {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);

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
  }, [refresh]);

  const toogleSidebar = () => {
    setSidebar((prev) => !prev);
  }

  const handleNewChat = async () => {
  try {
    const response = await createSession();

    const newSessionId = response.data.session_id;

    setSessions((prev) => [
      ...prev,
      { session_id: newSessionId }
    ]);

    navigate(`/chat/${newSessionId}`);
  } catch (error) {
    console.error("Failed to create new chat:", error);
  }
};

  
  
  return (
    <aside className={`sidebar ${sidebaropen ? "open" : "closed"}`}>
    <button
      className="sidebar-toggle"
      onClick={toogleSidebar}
    >
      ☰
    </button>
      <button className="new-chat-btn" onClick={handleNewChat} >
        + New Chat
      </button>

       <div className="chat-history">
        {sessions.map((session) => (
          <div
            key={session.session_id}
            className="chat-history-item"
            onClick={() => navigate(`/chat/${session.session_id}`)}
          >
            {session.session_id}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;