import React, { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { sendMessage } from "../services/api";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button className="send-btn" type="submit" disabled={pending}>
      Ask
    </button>
  );
};

const Chatinput = ({ messages, setMessages, addOptimisticMessage, sessionId, onPendingChange }) => {
  const formRef = useRef(null);
  

  const [state, formAction, isPending] = useActionState(
    async (previousState, formData) => {
      const question = formData.get("question")?.trim();
      if (!question) return { error: "Please enter a question." };

      formRef.current?.reset();

      const userMessage = { 
        id: `temp-${Date.now()}`,
        role: "user", 
        content: question,
       };
      addOptimisticMessage(userMessage);

      try {
        const response = await sendMessage(question, sessionId);
        setMessages((prev) => [
          ...prev,
          userMessage,
          {
            id: response.data.message_id,
            role: "assistant",
            content: response.data.answer,
            source: response.data.source,
          },
        ]);
        return { error: null };
      } catch (error) {
        return { error: "Something went wrong. Please try again." };
      }
    },
    { error: null }
  );

  // report pending state up to ChatPage
  useEffect(() => {
    onPendingChange(isPending);
  }, [isPending, onPendingChange]);

  return (
    <div className="ask-wrap">
      <div className="ask-card">
        <form ref={formRef} action={formAction}>
          <input
            className="ask-input"
            name="question"
            placeholder="Ask me anything"
            autoComplete="off"
          />
          <SubmitButton />
        </form>
        {state.error && <p>{state.error}</p>}
      </div>
    </div>
  );
};

export default Chatinput;