import Chatwindow from "../components/Chatwindow";
import Navbar from "../components/Navbar";
import React, { useEffect, useState, useOptimistic } from "react";
import Chatinput from "../components/Chatinput";
import { createSession, getMessages } from "../services/api";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);

  const [sessionId, setSessionId] = useState(null);

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
        setMessages(response.data.messages);

        if (response.data.messages.length > 0) {
          setMessages(response.data.messages);
        } else {
          // First time chat
          setMessages([]);
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
      <Navbar />

      <main>
        <Chatwindow messages={optimisticMessages} />

        <Chatinput
          messages={messages}
          setMessages={setMessages}
          addOptimisticMessage={addOptimisticMessage}
          sessionId={sessionId}
        />
      </main>
    </>
  );
};

export default ChatPage;