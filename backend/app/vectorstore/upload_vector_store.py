from langchain_chroma import Chroma

UPLOAD_CHROMA_DIR = "uploaded_chroma_db"

def create_upload_vector_store(chunks, embeddings):
    vector_store = Chroma(
        collection_name="uploaded_documents",
        persist_directory=UPLOAD_CHROMA_DIR,
        embedding_function=embeddings,
    )

    vector_store.add_documents(chunks)

    return vector_store


def load_upload_vector_store(embeddings):
    return Chroma(
        collection_name="uploaded_documents",
        persist_directory=UPLOAD_CHROMA_DIR,
        embedding_function=embeddings,
    )
