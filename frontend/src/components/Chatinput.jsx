import React, { useActionState, useOptimistic ,useRef } from "react";
import { useFormStatus } from "react-dom";
import { sendMessage } from "../services/api";


const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className="send-btn"
      type="submit"
      disabled={pending}
    >
    Ask
    </button>
  );
};

const Chatinput = ({ messages, setMessages , addOptimisticMessage, sessionId }) => {

  const formRef = useRef(null);

  const [state, formAction] = useActionState(async (previousState, formData) => {

      const question = formData.get("question")?.trim();

      if (!question) {
        return {
          error: "Please enter a question.",
        };
      }

      formRef.current?.reset();

      // Immediately show user's message
      const userMessage = {
        role: "user",
        content: question,
      };
      const thinkMessage={
         role: "assistant",
         content: "Thinking...",
      }

      addOptimisticMessage(userMessage);
      addOptimisticMessage(thinkMessage);

      // api cal
      try {
        const response = await sendMessage(question, sessionId);
        setMessages((prevMessages) => [
          ...prevMessages,
          userMessage,
          {
            role: "assistant",
            content: response.data.answer,
            source: response.data.source,
          },
        ]);

        return {
          error: null,
        };

      } catch (error) {

        return {
          error: "Something went wrong. Please try again.",
        };
      }
    },
    {
      error: null,
    }
  );

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

        {state.error && (
          <p>{state.error}</p>
        )}

      </div>
    </div>
  );
};

export default Chatinput;