import Chatwindow from "../components/Chatwindow";
import Navbar from "../components/Navbar";
import React, { useEffect, useState, useOptimistic } from "react";
import Chatinput from "../components/Chatinput";
import { createSession, getMessages } from "../services/api";
import "../styles/chat.css";
import Sidebar from "../components/Sidebar";
import {useParams,useNavigate} from "react-router-dom"

const ChatPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const{session_id}=useParams()
  const navigate=useNavigate()
  const [sessionId, setSessionId] = useState(null);
  const [welcomeState, setWelcomeState] = useState("waiting");
  const WELCOME_MESSAGE=
  `Hello! 👋 I'm your Enterprise Knowledge Assistant.

        I can help you with:
        • Leave & attendance policies
        • Employee benefits
        • Reimbursement policies
        • Remote work policies
        • Employee handbook & company policies

        You can ask me a question about any of these topics.`

    const [sidebaropen, setSidebar] = useState(true);

  // Create or load session
  useEffect(() => {
  const initializeSession = async () => {
    try {
      let activeSessionId = session_id;

      // If /chat is opened without a session ID, create a new session
      if (!activeSessionId) {
        const response = await createSession();
        activeSessionId = response.data.session_id;

        navigate(`/chat/${activeSessionId}`, { replace: true });
        return;
      }

      setSessionId(activeSessionId);

      // Load messages for this session
      const response = await getMessages(activeSessionId);

      if (response.data.messages.length > 0) {
        setMessages(response.data.messages);
        setWelcomeState("done");
      }  else {
    setMessages([]);
    setWelcomeState("waiting");

    setTimeout(() => {
        setWelcomeState("shown");
    }, 5000);
}

  
    } catch (error) {
      console.error("Failed to initialize chat:", error);
    }
  };

  initializeSession();
}, [session_id]);

  const [optimisticMessages, addOptimisticMessage] =
    useOptimistic(
      messages,
      (currentMessages, newMessage) => [
        ...currentMessages,
        newMessage,
      ]
    );



  return (
    <>
    <div className={`chat-layout ${sidebaropen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar 
       sidebaropen={sidebaropen}
        setSidebar={setSidebar}
       
      />

      <div className="chat-main">
      <Navbar />

      <main>
        <Chatwindow messages={optimisticMessages} 
        isLoading={isLoading} 
        welcomeState={welcomeState}
         welcomeMessage={WELCOME_MESSAGE}
         />

        <Chatinput
          messages={messages}
          setMessages={setMessages}
          addOptimisticMessage={addOptimisticMessage}
          sessionId={sessionId}
          onPendingChange={setIsLoading}
        />
     

      </main>
         </div>
        </div>
    </>
  );
};

export default ChatPage;