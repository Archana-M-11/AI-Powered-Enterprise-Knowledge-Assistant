import hashlib
import json
from pathlib import Path

from app.loaders.knowlede_loader import load_documents
from app.services.chunker import split_documents
from app.vectorstore.embeddings import create_embeddings
from app.vectorstore.chroma_store import create_vector_store,load_vectore_store


KNOWLEDGE_BASE_DIR = Path("knowledge_base")
INDEX_METADATA_FILE = Path("index_metadata.json")

def get_file_hash(file_path:Path):
    hasher=hashlib.sha256()
    with open(file_path, "rb") as file:
        while chunk := file.read(8192):
            hasher.update(chunk)

    return hasher.hexdigest()

def load_index_metadata():
    if not INDEX_METADATA_FILE.exists():
        return {}

    with open(INDEX_METADATA_FILE, "r") as file:
        return json.load(file)

def save_index_metadata(metadata):
     with open(INDEX_METADATA_FILE, "w") as file:
        json.dump(metadata, file, indent=4)


def build_vector_store():

    embeddings = create_embeddings()
    metadata = load_index_metadata()

    current_files = {}

    for pdf_file in KNOWLEDGE_BASE_DIR.glob("*.pdf"):
        current_files[str(pdf_file)] = get_file_hash(pdf_file)

    new_or_changed_files = []

    for file_path, file_hash in current_files.items():

        if metadata.get(file_path) != file_hash:
            new_or_changed_files.append(file_path)

    if not new_or_changed_files and Path("chroma_db").exists():
        return load_vectore_store(embeddings)

    documents = load_documents()
    chunks = split_documents(documents)

    vector_store = create_vector_store(
        chunks,
        embeddings,
    )

    save_index_metadata(current_files)

    return vector_store



