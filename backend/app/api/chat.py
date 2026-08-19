from fastapi import APIRouter
from app.schemas.chat import ChatRequest
from app.services.chat_service import generate_response

router=APIRouter()

@router.post('/chat')
def chat(request: ChatRequest):
    answer=generate_response(request.question)
    return {
        "answer": answer
    }
