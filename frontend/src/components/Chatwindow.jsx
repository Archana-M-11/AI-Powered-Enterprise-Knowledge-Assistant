import React from "react";
import ReactMarkdown from "react-markdown";

const Chatwindow = ({ messages }) => {
  return (
    <section className="thread">
      {messages.map((message, index) => (
        message.role === 'user' ? (
          <div key={index} className="msg user">
            <div className="bubble">{message.content}</div>
          </div>
        ) : (
          <div key={index} className="msg assistant">
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
    </section>
  );  
};

export default Chatwindow;