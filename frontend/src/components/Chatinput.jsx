import React, { useActionState, useEffect, useRef ,useState } from "react";
import { useFormStatus } from "react-dom";
import { sendMessage , uploadDocument} from "../services/api";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button className="send-btn" type="submit" disabled={pending}>
      Ask
    </button>
  );
};

const Chatinput = ({ messages, setMessages, addOptimisticMessage, sessionId, onPendingChange,
                   onSessionUpdated }) => {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [pendingFile, setPendingFile] = useState(null);

   const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
    e.target.value = "";
  };

  const removePendingFile = () => {
    setPendingFile(null);
  };

  const [state, formAction, isPending] = useActionState(
    async (previousState, formData) => {
      const question = formData.get("question")?.trim();
       if (!question && !pendingFile) 
        return { 
      error: "Please enter a question."
     };
     let fileMessage=null;
       if (pendingFile) {
        const fileName = pendingFile?.name;
        try {
          await uploadDocument(sessionId, pendingFile);
        } catch (error) {
          return { error: error.response?.data?.detail || "File upload failed." };
        }
          fileMessage = {
          id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          role: "user",
          type: "file",
          filename: fileName,
        };
        setPendingFile(null);
      }

      if (!question) return { error: null };

      formRef.current?.reset();

      const userMessage = { 
        id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: "user", 
        content: question
       };

       if (fileMessage) {
        addOptimisticMessage(fileMessage);
      }
      addOptimisticMessage(userMessage);

      try {
        const response = await sendMessage(question, sessionId);
        setMessages((prev) => [
          ...prev,
          ...(fileMessage ? [fileMessage] : []), 
          userMessage,
          {
            id: response.data.message_id,
            role: "assistant",
            content: response.data.answer,
            source: response.data.source,
          },
        ]);
        onSessionUpdated();
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
            {pendingFile && (
            <div className="file-chip">
              📎 {pendingFile.name}
              <button type="button" onClick={removePendingFile}>
                ✕
              </button>
            </div>
          )}
        <form ref={formRef} action={formAction}>

          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.txt"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <button
            type="button"
            className="attach-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            +
          </button>
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