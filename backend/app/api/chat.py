from fastapi import APIRouter
from app.schemas.chat import ChatRequest
# from app.services.chat_service import generate_response
from app.services.rag_service import ask_question

router=APIRouter()

@router.post('/chat')
def chat(request: ChatRequest):
    answer=ask_question(request.question)
    return {
        "answer": answer
    }
