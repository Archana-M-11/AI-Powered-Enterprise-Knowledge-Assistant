import axios from 'axios'

const api=axios.create({
     baseURL: "http://127.0.0.1:8000",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
})

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        const response = await api.post("/refresh", {
          refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;

        localStorage.setItem("access_token", newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
)


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

export const userRegister=async (userData)=>{
  const response=await api.post("/register",userData)
  return response.data
}


export const userLogin=async (userData)=>{
  const response=await api.post("/login",userData)
  localStorage.setItem("access_token", response.data.access_token);
  localStorage.setItem("refresh_token", response.data.refresh_token);
  return response.data
}

export const getSessions=()=>{
  return api.get('/sessions')
}

export const getCurrentUser = () => {
  return api.get("/me");
}