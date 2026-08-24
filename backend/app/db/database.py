from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings
from sqlalchemy.ext.asyncio import (create_async_engine,async_sessionmaker,AsyncSession)
from typing import AsyncGenerator

DATABASE_URL = (
    f"postgresql+asyncpg://"
    f"{settings.database_user}:"
    f"{settings.database_password}@"
    f"{settings.database_host}:"
    f"{settings.database_port}/"
    f"{settings.database_name}"
)

engine=create_async_engine(DATABASE_URL)

class Base(DeclarativeBase):
    pass

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session