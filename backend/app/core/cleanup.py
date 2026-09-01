import asyncio
from datetime import datetime, timedelta
from pathlib import Path

from sqlalchemy import select

from app.db.models import Document
from app.db.database import AsyncSessionLocal


async def delete_expired_documents():
    while True:
        async with AsyncSessionLocal() as db:

            cutoff = datetime.utcnow() - timedelta(hours=24)

            result = await db.execute(
                select(Document).where(
                    Document.created_at < cutoff
                )
            )

            expired_documents = result.scalars().all()

            for document in expired_documents:
                file_path = Path(document.file_path)

                if file_path.exists():
                    file_path.unlink()

                await db.delete(document)

            await db.commit()

        await asyncio.sleep(3600)