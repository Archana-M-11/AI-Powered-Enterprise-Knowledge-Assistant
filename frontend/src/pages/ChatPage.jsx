import Chatwindow from "../components/Chatwindow";
import Navbar from "../components/Navbar";
import React, { useState, useOptimistic } from "react";
import Chatinput from "../components/Chatinput";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);

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
        />
      </main>
    </>
  );
};

export default ChatPage;