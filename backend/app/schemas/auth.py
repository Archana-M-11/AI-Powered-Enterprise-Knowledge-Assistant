from pydantic import BaseModel,EmailStr

class RegisterRequest(BaseModel):
    name:str
    email:EmailStr
    password:str

class RegisterResponse(BaseModel):
    id:str
    email:EmailStr
    