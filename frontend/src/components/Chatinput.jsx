import React, { useActionState, useOptimistic } from "react";
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
      {pending ? "thinking..." : "Ask"}
    </button>
  );
};

const Chatinput = ({ messages, setMessages }) => {

  const [optimisticMessages, addOptimisticMessage] =
    useOptimistic(messages);

  const [state, formAction] = useActionState(
    async (previousState, formData) => {

      const question = formData.get("question")?.trim();

      if (!question) {
        return {
          error: "Please enter a question.",
        };
      }

      // 1. Immediately show user's message
      const userMessage = {
        role: "user",
        content: question,
      };

      addOptimisticMessage(userMessage);

      try {
        const response = await sendMessage(question);
        setMessages((prevMessages) => [
          ...prevMessages,
          userMessage,
          {
            role: "assistant",
            content: response.data.answer,
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

        <form action={formAction}>

          <input
            className="ask-input"
            name="question"
            placeholder="Ask me anything"
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