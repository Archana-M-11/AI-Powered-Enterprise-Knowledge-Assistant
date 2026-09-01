from sqlalchemy import ForeignKey,DateTime,Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column,relationship,Mapped
import uuid
from datetime import datetime

from app.db.database import Base

class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        )
    title: Mapped[str] = mapped_column(
    Text,
    nullable=False,
    default="New Chat",
)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )   

    messages: Mapped[list["Message"]] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
    )
    user: Mapped["User"] = relationship(
    back_populates="sessions"
    )


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("sessions.id"),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(Text)
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    session: Mapped["Session"] = relationship(
        back_populates="messages"
    )

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        )

    name: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )


    email: Mapped[str] = mapped_column(
            Text,
            unique=True,
            nullable=False,
        )

    password_hash: Mapped[str] = mapped_column(
            Text,
            nullable=False,
        )

    created_at: Mapped[datetime] = mapped_column(
            DateTime,
            default=datetime.utcnow,
        )

    sessions: Mapped[list["Session"]] = relationship(
            back_populates="user",
            cascade="all, delete-orphan",
        )