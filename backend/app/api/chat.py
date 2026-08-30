from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.schemas.chat import ChatRequest,ChatResponse,SessionResponse,MessageHistoryResponse,MessageResponse
from app.graph.flow import graph
from app.db.database import get_db
from uuid import UUID
from app.repositories.session_repository import (create_session,save_message,get_messages,get_session_by_user,
                                                 get_user_sessions)
from app.core.auth import get_current_user

router = APIRouter()
import os


@router.post("/sessions",response_model=SessionResponse)
async def create_chat_session(db: AsyncSession = Depends(get_db),current_user:UUID=Depends(get_current_user)):
    session = await create_session(
        db,
        current_user
        )
    return {
        "session_id": session.id
    }


@router.post("/chat",response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user:UUID=Depends(get_current_user)) :

    session=await get_session_by_user(
        db,
        request.session_id,
        current_user
    )
    if not session:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this session",
        )

# get previous chat 
    previous_msg =await get_messages(
        db,
        request.session_id
    )
    history=[
        {
            "role":message.role,
            "content":message.content
        }
        for message in previous_msg
    ]
    # Save user's message
    await save_message(
        db,
        request.session_id,
        "user",
        request.question,
    )   

    # LangGraph logic
    result = graph.invoke({
        "user_query": request.question,
        "history":history
    })

    answer = result["answer"]

    # Save AI's response
    await save_message(
        db,
        request.session_id,
        "assistant",
        answer,
    )

    # Return response to frontend
    return {
        "answer": answer,
        "source": result.get("source", []),
        "session_id": request.session_id,
    }

@router.get("/sessions/{session_id}/messages",response_model=MessageHistoryResponse)
async def get_chat_messages(
    session_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user:UUID=Depends(get_current_user)
):

    session=await get_session_by_user(
        db,
        session_id,
        current_user
    )

    if not session :
        raise HTTPException(
           status_code=403,
           detail="Not authorized to access this session" 
        )
    
    messages = await get_messages(db, session_id)

    return {
        "session_id": session_id,
        "messages": [
            {
                "id": message.id,
                "role": message.role,
                "content": message.content,
                "created_at": message.created_at,
            }
            for message in messages
        ],
    }

@router.get('/sessions',response_model=list[SessionResponse])
async def get_sessions(db:AsyncSession=Depends(get_db),current_user:UUID=Depends(get_current_user)):
    sessions=await get_user_sessions(
        db,
        current_user
    )
    return[
        {
            "session_id":session.id
        }
        for session in sessions
    ]


# print("TRACING:", settings.langsmith_tracing)
# print("PROJECT:", settings.langsmith_project)
# print("API KEY EXISTS:", bool(settings.langsmith_api_key))