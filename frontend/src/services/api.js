import axios from 'axios'

const api=axios.create({
     baseURL: "http://127.0.0.1:8000",
})


export const createSession = () => {
  return api.post("/sessions");
};

export const sendMessage = (question, sessionId) => {
  return api.post("/chat", {
    question,
    session_id: sessionId,
  });
};

export const getMessages = (sessionId) => {
  return api.get(`/sessions/${sessionId}/messages`);
};