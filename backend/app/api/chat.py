from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.schemas.chat import ChatRequest
from app.graph.flow import graph
from app.db.database import get_db
from uuid import UUID
from app.repositories.session_repository import (create_session,save_message,get_messages)

router = APIRouter()
import os



@router.post("/sessions")
async def create_chat_session(
    db: AsyncSession = Depends(get_db),
):
    session = await create_session(db)
    return {
        "session_id": session.id
    }


@router.post("/chat")
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
):

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

@router.get("/sessions/{session_id}/messages")
async def get_chat_messages(
    session_id: UUID,
    db: AsyncSession = Depends(get_db),
):
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

# print("TRACING:", settings.langsmith_tracing)
# print("PROJECT:", settings.langsmith_project)
# print("API KEY EXISTS:", bool(settings.langsmith_api_key))