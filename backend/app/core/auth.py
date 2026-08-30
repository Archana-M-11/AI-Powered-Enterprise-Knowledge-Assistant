from pwdlib import PasswordHash
from jose import jwt,JWTError
from app.core.config import settings
from fastapi import Depends,HTTPException
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)

def create_access_token(user_id:str)->str :
    payload={
        "sub":user_id,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15),
    }
    token=jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm
    )
    return token 

def decode_access_token(token:str):
    try:
        payload=jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )
        if payload.get("type") != "access":
            return None
        
        return payload
    except JWTError:
        return None

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="/login")

async def get_current_user(token:str=Depends(oauth2_scheme)):

    payload=decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id=payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
    return user_id

def create_refresh_token(user_id:str)->str:
    payload={
        "sub":user_id,
        "type":"refresh",
        "exp":datetime.now(timezone.utc) + timedelta(days=7),
    }
    token=jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm
    )
    return token

def decode_refresh_token(token:str):
    try:
        payload=jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )
        if payload.get("type") != "refresh":
            return None
        return payload
    except JWTError:
        return None

        
