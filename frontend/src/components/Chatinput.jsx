import React, { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { sendMessage, uploadDocument } from "../services/api";
import toast from "react-hot-toast";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button className="send-btn" type="submit" disabled={pending}>
      ↑
    </button>
  );
};

const Chatinput = ({ messages, setMessages, addOptimisticMessage, sessionId, onPendingChange, onSessionUpdated }) => {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setPendingFile(file);
    setUploading(true);

    try {
      await uploadDocument(sessionId, file);
      toast.success("File uploaded — will be deleted after 24 hours");
    } catch (error) {
      const message = error.response?.data?.detail || "File upload failed.";
      toast.error(message);
      setPendingFile(null);
    } finally {
      setUploading(false);
    }
  };

  const removePendingFile = () => {
    setPendingFile(null);
  };

  const [state, formAction, isPending] = useActionState(
    async (previousState, formData) => {
      const question = formData.get("question")?.trim();
      if (!question && !pendingFile) return { error: "Please enter a question." };

      let fileMessage = null;
      if (pendingFile) {
        fileMessage = {
          id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          role: "user",
          type: "file",
          filename: pendingFile.name,
        };
      
      }

      if (!question) return { error: null };

      formRef.current?.reset();

      const userMessage = {
        id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: "user",
        content: question,
      };

      if (fileMessage) 
        addOptimisticMessage(fileMessage);
        setPendingFile(null);
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

  useEffect(() => {
    onPendingChange(isPending || uploading);
  }, [isPending, uploading, onPendingChange]);

  return (
    <div className="ask-wrap">
      <div className="ask-card">
        {pendingFile && (
          <div className="file-chip">
            📎 {pendingFile.name}
            {uploading && <span className="uploading-dot"> uploading…</span>}
            <button type="button" onClick={removePendingFile}>✕</button>
          </div>
        )}
        <form ref={formRef} action={formAction}
         onSubmit={() => {
    if (pendingFile) setPendingFile(null);
  }}
  >
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.txt"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <button type="button" className="attach-btn" onClick={() => fileInputRef.current?.click()}>
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