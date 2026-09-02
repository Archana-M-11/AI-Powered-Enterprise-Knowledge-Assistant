from app.vectorstore.embeddings import embeddings
from app.vectorstore.chroma_store import load_vectore_store
from app.vectorstore.upload_vector_store import load_upload_vector_store


def retrieve_documents(query, k=4):
    # embeddings = create_embeddings()
    vector_store = load_vectore_store(embeddings)
    return vector_store.similarity_search_with_score(query, k=k)


def retrieve_uploaded_documents(query, session_id, user_id, k=4):
    vector_store = load_upload_vector_store(embeddings)
    return vector_store.similarity_search_with_score(
        query,
        k=k,
        filter={
            "$and": [
                {"session_id": str(session_id)},
                {"user_id": str(user_id)}
            ]
        }
    )
    















