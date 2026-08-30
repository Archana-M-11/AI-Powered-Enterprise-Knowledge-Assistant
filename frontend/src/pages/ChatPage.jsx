import Chatwindow from "../components/Chatwindow";
import Navbar from "../components/Navbar";
import React, { useEffect, useState, useOptimistic } from "react";
import Chatinput from "../components/Chatinput";
import { createSession, getMessages } from "../services/api";
import "../styles/chat.css";
import Sidebar from "../components/Sidebar";

const ChatPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

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
        let storedSessionId = sessionStorage.getItem("session_id");

        // No existing session , create one
        if (!storedSessionId) {
          const response = await createSession();
          storedSessionId = response.data.session_id;

         sessionStorage.setItem("session_id", storedSessionId);
        }

        setSessionId(storedSessionId);

        // Load previous messages
        const response = await getMessages(storedSessionId);

        if (response.data.messages.length > 0) {
          setMessages(response.data.messages);
            setWelcomeState("done");
        } else {
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
  }, []);

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