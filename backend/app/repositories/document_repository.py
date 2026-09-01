from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,UUID
from app.db.models import Document
from pathlib import Path
import uuid
from fastapi import UploadFile
from pypdf import PdfReader
  

async def create_document(db: AsyncSession,session_id:UUID,user_id:UUID,
                          filename:str,file_type:str,file_path:str) -> Document:
    document=Document(
        session_id=session_id,
        user_id=user_id,
        filename=filename,
        file_type=file_type,
        file_path=file_path
    )
    db.add(document)
    await db.commit()
    await db.refresh(document)
    return document


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

async def save_uploaded_file(file: UploadFile) -> str:
    file_extension = Path(file.filename).suffix.lower()

    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename

    content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    return str(file_path)

async def extract_pdf_text(file_path: str) -> str:
    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text


async def extract_txt_text(file_path: str) -> str:
    return Path(file_path).read_text(encoding="utf-8")

async def extract_text(file_path: str, file_type: str) -> str:

    if file_type == "pdf":
        return await extract_pdf_text(file_path)

    if file_type == "txt":
        return await extract_txt_text(file_path)

    raise ValueError("Unsupported file type")


