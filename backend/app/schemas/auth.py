from pydantic import BaseModel,EmailStr

class RegisterRequest(BaseModel):
    name:str
    email:EmailStr
    password:str

class RegisterResponse(BaseModel):
    id:str
    email:EmailStr

class LoginRequest(BaseModel):
    email:EmailStr
    password:str

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
