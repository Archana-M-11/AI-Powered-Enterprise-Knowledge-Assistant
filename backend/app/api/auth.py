from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.auth import RegisterRequest, RegisterResponse
from app.repositories.user_repository import (get_user_by_email,create_user)
from app.core.auth import hash_password

router=APIRouter()

@router.post("/register", response_model=RegisterResponse)
async def register(request: RegisterRequest,db:AsyncSession=Depends(get_db)):
    existing_user = await get_user_by_email(
        db,
        request.email,
    )
    if existing_user:
          raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )
    password_hash = hash_password(request.password)

    user = await create_user(
        db,
        request.name,
        request.email,
        password_hash
    )
    #http response for the /register
    return {
        "id": str(user.id),
        "email": user.email,
    }
