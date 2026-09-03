# AI-Powered Enterprise Knowledge Assistant

## Overview

An AI-powered enterprise knowledge assistant built using Retrieval-Augmented
Generation (RAG). Users can ask questions about enterprise documents, and the
system retrieves relevant information from the knowledge base and generates
grounded answers using an LLM.

The application consists of a FastAPI backend and React frontend, with
LangGraph used to orchestrate the query-processing workflow.


## Key Features

- React-based chat interface
- FastAPI `/chat` API
- PDF document ingestion
- Document chunking
- Hugging Face embedding generation
- Chroma vector database
- Top-K semantic retrieval
- Similarity-distance threshold filtering
- Query classification
- Conditional routing with LangGraph
- Grounded LLM answer generation
- Structured LLM output using Pydantic
- Source citation from document metadata
- Fallback response for irrelevant queries
- Out-of-scope query handling
- PostgreSQL database integration
- Persistent chat sessions and message history
- Session-based conversation history
- User registration and login
- JWT-based authentication
- Protected session and chat APIs
- Password hashing using Argon2id
- User-specific chat sessions
- Persistent user authentication
- Access and refresh token handling
- Employee document upload (PDF/TXT)
- Separate vector store for uploaded documents
- User- and session-isolated document retrieval
- Temporary uploaded-document storage
- 24-hour upload limit
- Automatic expired-document cleanup
- File size validation
- File type validation
- Optimistic file-message rendering in the chat UI

## Frontend

React (Vite) chat interface that sends user questions to the backend
and renders the returned answer, sources, or a "not found" fallback.

```text
frontend/
└── src/
    ├── components/    # Chatinput, Chatwindow, Navbar , Sidebar
    ├── pages/         # ChatPage , Regiter , Login
    └── services/      # api.js — centralized Axios instance
   
```
- Axios interceptors handle authentication tokens and token refresh.
- The Navbar displays the authenticated user's name.
- Chat sessions are loaded for the authenticated user.

- All API calls go through `services/api.js` rather than being called
  directly from components, so the backend base URL and endpoint paths
  live in one place.
- Styling uses CSS custom properties defined in `index.css` (color
  tokens, fonts) so the theme can be adjusted without touching
  component files.
## Backend

FastAPI service exposing chat and session APIs that the frontend calls.
Owns document ingestion, chunking, embedding, vector storage, retrieval,
and LangGraph-orchestrated answer generation.

```text

backend/
└── app/
    ├── api/            # authentication, chat, and session endpoints
    ├── core/           # config, authentication, shared utilities , Expired-document cleanup
    ├── graph/          # LangGraph workflow
    ├── loaders/        # document loading
    ├── services/       # application logic
    ├── vectorstore/    # embeddings + vector DB(Company and uploaded-document vector stores)
    ├── db/             # database, models, repositories
    └── schemas/        # Pydantic request/response schemas

```

The backend provides chat and session APIs with CORS enabled for the frontend. The RAG pipeline, LangGraph workflow, and PostgreSQL-based chat persistence are integrated into the backend.

### RAG Core Pipeline

📄 **Document Loading** → 🧩 **Chunking** → 🔢 **Embedding** → 🗄️ **Vector Store** → 🔍 **Similarity Search** → 🧠 **LLM Generation (LangGraph)** → 💬 **Answer + Sources**

Company knowledge → chroma_db/
Employee uploads → uploaded_chroma_db/
### Document Flow

```text
Upload
  ↓
Local file + PostgreSQL metadata + Chroma chunks
  ↓
Available for retrieval
  ↓
Retention period expires
  ↓
Cleanup
  ├── Delete Chroma chunks
  ├── Delete physical file
  └── Delete PostgreSQL metadata
```

### LangGraph Workflow

```text
START
  ↓
Query Classification
  ↓
Conditional Routing
  ├── Greeting → Greeting Response → END  
  ├── Thanks → Thank Response → END
  ├── Out of Scope → Scope Response → END
  │
  └── Knowledge
        ↓
    Retrieve Documents
        ↓
    Relevance Check
       ├── Not Relevant → Fallback Response → END
       │
       └── Relevant
             ↓
       LLM Generation
             ↓
        Answer + Sources
             ↓
            END

```
### Authentication Flow

Register
   ↓
Password hashed with Argon2id
   ↓
User stored in PostgreSQL
   ↓
Login
   ↓
JWT access + refresh tokens
   ↓
Protected API requests
   ↓
Backend identifies authenticated user
   ↓
User-specific sessions and chat history

## Installation

### Backend

The backend uses `uv` for dependency management.

```bash
# Install uv if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh

cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env

DATABASE_URL=your_database_url
JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256
GEMINI_API_KEY=your_gemini_api_key
HF_TOKEN=your_huggingface_token
LANGSMITH_API_KEY=your_langsmith_api_key
LANGSMITH_TRACING=false
LANGCHAIN_PROJECT=your_project_name

```

## API

### `POST /chat`

Accepts a user question and session ID, processes the question through the RAG/LangGraph pipeline, stores the user and assistant messages, and returns the generated answer and sources.

**Request**
```json
{ "question": "What is the reimbursement policy for conference travel?",
  "session_id": "your-session-id"
 }
```

**Response**
```json
{
  "answer": "The reimbursement policy ...",
  "source": [
    "reimbursement_policy_detailed.pdf"
  ],
  "session_id": "your-session-id"
}
```
### `POST /sessions`

Creates a new chat session for the authenticated user and returns a session ID.

### `GET /sessions/{session_id}/messages`
Retrieves the message history for a specific chat session belonging to the authenticated user.

**Response**
```json
{
  "session_id": "your-session-id",
  "messages": [
    {
      "id": "message-id",
      "role": "user",
      "content": "What is the reimbursement policy?",
      "created_at": "..."
    },
    {
      "id": "message-id",
      "role": "assistant",
      "content": "The reimbursement policy ...",
      "created_at": "..."
    }
  ]
}
```

### `POST /register`

Registers a new user.

**Request**

```json
{
  "name": "Archana",
  "email": "user@example.com",
  "password": "password"
}
```

**Response**
```json
{
  "id": "user-id",
  "email": "user@example.com"
}
```

### `POST /login`

Authenticates an existing user using their email and password and returns access and refresh tokens.

**Request**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```
**Response**

```json
{
  "access_token": "your-access-token",
  "refresh_token": "your-refresh-token",
  "token_type": "bearer"
}
```
### `GET /sessions`
Retrieves the chat sessions belonging to the authenticated user.

```json
[
  {
    "session_id": "session-id-1"
  },
  {
    "session_id": "session-id-2"
  }
]
```
### POST /sessions/{session_id}/upload

Uploads a PDF/TXT document for the authenticated user's chat session.

The document is validated, temporarily stored, processed into chunks,
embedded, and stored in the uploaded-document Chroma vector store.





