import Chatwindow from "../components/Chatwindow";
import Navbar from "../components/Navbar";
import React, { useState, useOptimistic } from "react";
import Chatinput from "../components/Chatinput";

const ChatPage = () => {
  const [messages, setMessages] = useState([
      {
    role: "assistant",
    content: `Hello! 👋 I'm your Enterprise Knowledge Assistant.\n
I can help you with:
• Leave & attendance policies
• Employee benefits
• Reimbursement policies
• Remote work policies
• Employee handbook & company policies

You can ask me a question about any of these topics.`,
  },

  ]);

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