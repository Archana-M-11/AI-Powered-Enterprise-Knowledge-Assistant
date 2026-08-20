import React from "react";

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
            <div className="answer">{message.content}</div>
          </div>
        )
      ))}
    </section>
  );  
};

export default Chatwindow;