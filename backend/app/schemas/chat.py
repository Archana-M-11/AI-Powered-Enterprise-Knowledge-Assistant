from pydantic import BaseModel
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime


class ChatRequest(BaseModel):
    question:str
    session_id: UUID

class ChatResponse(BaseModel):
    answer: str
    source: list[str]
    session_id: UUID


class SessionResponse(BaseModel):
    session_id: UUID
    title:str


class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    created_at: datetime


class MessageHistoryResponse(BaseModel):
    session_id: UUID
    messages: list[MessageResponse]
    

class AnswerResponse(BaseModel):
    answer: str = Field( description="A clear, concise answer to the user's question.")
    sources: list[str] = Field(description="Source documents used to answer the question.")




