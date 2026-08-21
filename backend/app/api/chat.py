from fastapi import APIRouter
from app.schemas.chat import ChatRequest
# from app.services.chat_service import generate_response
from app.graph.flow import graph 

router=APIRouter()

@router.post('/chat')
async def chat(request: ChatRequest):
    result=graph.invoke({
        "user_query":request.question
    })
    return {
        "answer": result["answer"],
        "source": result.get("source", [])
    }
