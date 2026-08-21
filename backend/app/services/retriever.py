from app.vectorstore.embeddings import embeddings
from app.vectorstore.chroma_store import load_vectore_store

def retrieve_documents(query, k=4):
    # embeddings = create_embeddings()

    vector_store = load_vectore_store(embeddings)

    return vector_store.similarity_search_with_score(query, k=k)
    















