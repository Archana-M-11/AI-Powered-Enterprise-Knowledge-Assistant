import React from "react";

const Chatwindow = () => {
  return (
    <section className="thread pb-5 mb-5">
      <div className="msg user">
        <div className="msg-role">YOU</div>

        <div className="bubble">
          What is leave policy?
        </div>
      </div>

      <div className="msg assistant">
        <div className="msg-role">ASSISTANT</div>

        <div className="answer">
          Employees are entitled to 20 days of annual leave.
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
    </section>
  );
};

export default Chatwindow;