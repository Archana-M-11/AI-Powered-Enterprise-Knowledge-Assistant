from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.chat import router as chat_router
from app.api.auth import router as auth_router
import asyncio
from app.core.cleanup import delete_expired_documents

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(chat_router)
app.include_router(auth_router)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(delete_expired_documents())