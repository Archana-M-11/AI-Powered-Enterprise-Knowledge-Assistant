from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,UUID
from app.db.models import Session,Message


async def create_session(db: AsyncSession,user_id:UUID) -> Session:
    new_session = Session(
        user_id=user_id
    )

    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)

    return new_session

async def save_message(db: AsyncSession,session_id:UUID,role: str,content: str,) -> Message:
    message = Message(
        session_id=session_id,
        role=role,
        content=content,
    )

    db.add(message)
    if role == "user":
        session = await db.get(Session, session_id)

        if session and session.title == "New Chat":
            session.title = content[:20] + (
                "..." if len(content) > 20 else ""
            )
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

async def get_session_by_user(db:AsyncSession,session_id:UUID,user_id:UUID):
    result=await db.execute(
        select(Session).where(
            Session.id==session_id,
            Session.user_id==user_id
        )
    )
    return result.scalar_one_or_none()

async def get_user_sessions(db:AsyncSession,user_id:UUID):
    result=await db.execute(
        select(Session).where(Session.user_id==user_id).order_by(Session.created_at.desc())
    )
    return result.scalars().all()