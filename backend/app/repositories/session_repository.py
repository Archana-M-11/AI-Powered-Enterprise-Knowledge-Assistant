from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models import Session,Message


async def create_session(db: AsyncSession) -> Session:
    new_session = Session()

    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)

    return new_session

async def save_message(
    db: AsyncSession,
    session_id,
    role: str,
    content: str,
) -> Message:
    message = Message(
        session_id=session_id,
        role=role,
        content=content,
    )

    db.add(message)
    await db.commit()
    await db.refresh(message)

    return message


async def get_messages(
    db: AsyncSession,
    session_id,
) -> list[Message]:
    result = await db.execute(
        select(Message)
        .where(Message.session_id == session_id)
        .order_by(Message.created_at)
    )

    return list(result.scalars().all())