from pydantic import BaseModel
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    question:str

class AnswerResponse(BaseModel):
    answer: str = Field( description="A clear, concise answer to the user's question.")
    sources: list[str] = Field(description="Source documents used to answer the question.")


