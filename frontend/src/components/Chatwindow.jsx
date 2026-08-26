import React from "react";
import ReactMarkdown from "react-markdown";

const Chatwindow = ({ messages ,isLoading,welcomeState,welcomeMessage }) => {
  return (
    <section className="thread">
      {welcomeState === "waiting" && (
  <div className="msg assistant">
    <div className="answer typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
)}

{/* First opening: welcome message */}
{welcomeState === "shown" && (
  <div className="msg assistant">
    <div className="answer">
      <ReactMarkdown>{welcomeMessage}</ReactMarkdown>
    </div>
  </div>
)}
      {messages.map((message) => (
        message.role === 'user' ? (
          <div key={message.id} className="msg user">
            <div className="bubble">{message.content}</div>
          </div>
        ) : (
          <div key={message.id} className="msg assistant">
            <div className="answer">
            <ReactMarkdown>{message.content}</ReactMarkdown>
               {message.source?.length > 0 && (
                <div className="sources">
                  Source: {message.source.join(", ")}
                </div>
              )}
            </div>
            
          </div>
        )
      ))}
     
      {isLoading && (
      <div className="msg assistant">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    )}
    </section>
  );  
};

export default Chatwindow;