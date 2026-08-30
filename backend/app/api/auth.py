from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.auth import RegisterRequest, RegisterResponse,LoginRequest,LoginResponse
from app.repositories.user_repository import (get_user_by_email,create_user)
from app.core.auth import hash_password,verify_password,create_access_token,create_refresh_token, decode_refresh_token

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

@router.post("/login",response_model=LoginResponse)
async def login(request:LoginRequest,db:AsyncSession=Depends(get_db)):
     user=await get_user_by_email(db,request.email)
     if not user:
           raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )
     if not verify_password(request.password,user.password_hash):
          
           raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )
     access_token=create_access_token(str(user.id))
     refresh_token=create_refresh_token(str(user.id))

     return{
          "access_token":access_token,
          "refresh_token":refresh_token,
          "token_type":"bearer"
     }

@router.post('/refresh',response_model=LoginResponse)
async def refresh_token(refresh_token: str):

    payload = decode_refresh_token(refresh_token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token"
        )

    user_id = payload.get("sub")

    new_access_token = create_access_token(user_id)

    return {
        "access_token": new_access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }





