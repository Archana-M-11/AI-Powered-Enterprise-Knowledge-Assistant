import React from "react";

const Chatwindow = ({messages}) => {

  return (
    <section className="thread pb-5 mb-5">
      {messages.map((message, index) => (
        message.role === 'user' ? (
    <div key={index} className="msg user">
      <div className="msg-role">YOU</div>

      <div className="bubble">
        {message.content}
      </div>
    </div>
        ):(
          <div key={index} className="msg assistant">
        <div className="msg-role">ASSISTANT</div>

        <div className="answer">
         {message.content}
        </div>

        <div className="sources">
          <div className="source-card d-flex flex-wrap align-items-baseline gap-2">
            <span className="source-idx">01</span>

            <span className="source-name text-break">
              Leave_Policy.pdf
            </span>

            <span className="source-meta ms-auto">
              Page 3
            </span>
          </div>
        </div>
      </div>
        )
  ))}
      
    </section>
  );
};

export default Chatwindow;