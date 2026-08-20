import hashlib
import json
from pathlib import Path

from app.loaders.knowlede_loader import load_documents
from app.services.chunker import split_documents
from app.vectorstore.embeddings import create_embeddings
from app.vectorstore.chroma_store import create_vector_store,load_vectore_store

from app.core.config import settings
from app.services.retriever import retrieve_documents
from langchain_google_genai import ChatGoogleGenerativeAI


llm=ChatGoogleGenerativeAI(
    model=settings.llm_model,
    google_api_key=settings.gemini_api_key
)

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

    # get current PDFs and hashes
    for pdf_file in KNOWLEDGE_BASE_DIR.glob("*.pdf"):
        current_files[str(pdf_file)] = get_file_hash(pdf_file)

    # first run
    if not Path("chroma_db").exists():

        pdf_files = list(KNOWLEDGE_BASE_DIR.glob("*.pdf"))

        documents = load_documents(pdf_files)
        chunks = split_documents(documents)

        vector_store = create_vector_store(
            chunks,
            embeddings,
        )

        save_index_metadata(current_files)

        return vector_store

    # Existing vector store
    vector_store = load_vectore_store(embeddings)

    # Find new/changed files
    new_or_changed_files = []

    for file_path, file_hash in current_files.items():

        if metadata.get(file_path) != file_hash:
            new_or_changed_files.append(file_path)

    # Process ONLY changed/new files
    for file_path in new_or_changed_files:

        documents = load_documents([Path(file_path)])
        chunks = split_documents(documents)

        # add new chunks
        vector_store.add_documents(chunks)

    save_index_metadata(current_files)

    return vector_store

#-----llm generation---

def ask_question(question:str):
    documents=retrieve_documents(question)

    context='\n\n'.join( document.page_content
        for document in documents)
    prompt= f""" You are an enterprise knowledge assistant.

            Answer the user's question using only the provided context.

            If the answer is not available in the context, say:
            "I couldn't find that information in the knowledge base."
             Context:{context}
            Question:{question}
        """

    response = llm.invoke(prompt)

    if isinstance(response.content, str):
        return response.content

    return "".join(
        block["text"]
        for block in response.content
        if block.get("type") == "text"
    )


