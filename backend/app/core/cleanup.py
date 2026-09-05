import asyncio
from datetime import datetime, timedelta
from pathlib import Path

from sqlalchemy import select

from app.db.models import Document
from app.db.database import AsyncSessionLocal
from app.vectorstore.upload_vector_store import load_upload_vector_store
from app.vectorstore.embeddings import embeddings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def delete_expired_documents():
    while True:
        async with AsyncSessionLocal() as db:
            cutoff = datetime.utcnow() - timedelta(minutes=1)

            result = await db.execute(
                select(Document).where(Document.created_at < cutoff)
            )
            expired_documents = result.scalars().all()

            if expired_documents:
                logger.info(f"Found {len(expired_documents)} expired document(s) to delete")

                vector_store = await asyncio.to_thread(load_upload_vector_store, embeddings)

                for document in expired_documents:
                    try:
                        await asyncio.to_thread(
                            vector_store._collection.delete,
                            where={"document_id": str(document.id)}
                        )

                        file_path = Path(document.file_path)
                        if file_path.exists():
                            await asyncio.to_thread(file_path.unlink)
                            logger.info(f"Deleted file: {file_path.resolve()}")
                        else:
                            logger.warning(f"File NOT found at: {file_path.resolve()}")

                        await db.delete(document)

                    except Exception as e:
                        logger.error(f"Failed to clean up document {document.id}: {e}")
                        continue

            await db.commit()

        await asyncio.sleep(60)