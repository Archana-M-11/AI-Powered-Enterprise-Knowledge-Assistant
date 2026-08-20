from langchain_huggingface import HuggingFaceEmbeddings
from app.core.config import settings

def create_embeddings():
    return (
    HuggingFaceEmbeddings(model_name=settings.embedding_model)
    )

embeddings=create_embeddings()
