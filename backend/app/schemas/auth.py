from pydantic import BaseModel,EmailStr, Field, field_validator

class RegisterRequest(BaseModel):
    name:str
    email:EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def validate_password(cls, password: str):
        if not any(c.isupper() for c in password):
            raise ValueError("Password must contain at least one uppercase letter")

        if not any(c.islower() for c in password):
            raise ValueError("Password must contain at least one lowercase letter")

        if not any(c.isdigit() for c in password):
            raise ValueError("Password must contain at least one number")

        if not any(c in "@$!%*?&" for c in password):
            raise ValueError("Password must contain at least one special character")

        return password

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
