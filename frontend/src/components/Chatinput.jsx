import React,{useState} from "react";

const Chatinput = ({setMessages}) => {
  const [input,setInput]=useState('')

  const handleSend=(e)=>{
    e.preventDefault()
    setMessages((prevMessages) => [
  ...prevMessages,
  {
    role: "user",
    content: input,
  },
]);
    // console.log(input)
    setInput("")
  }

  return (
    <div className="ask-wrap position-fixed bottom-0 start-0 w-100 px-3 px-md-4 pb-3">
      <span className="ask-tab">ASK</span>

      <div className="stack s1"></div>
      <div className="stack s2"></div>

      <div className="ask-card mx-auto">
        <textarea
          className="form-control"
          placeholder="Ask something about your knowledge base..."
          rows="2"
          value={input}
          onChange={(e)=>{
            setInput(e.target.value)
          }}
        />

        <div className="ask-footer">
          <span className="ask-hint d-none d-sm-inline">
            Ask anything about your documents
          </span>

          <span className="ask-hint d-inline d-sm-none">
            Ask your question
          </span>

          <button className="send-btn"
          onClick={handleSend}
          disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatinput;